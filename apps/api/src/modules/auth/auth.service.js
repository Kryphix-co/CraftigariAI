import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  createOtpSalt,
  generateOtp,
  hashOtp,
  otpMatches,
} from "./auth.crypto.js";
import { authRepository } from "./auth.repository.js";
import { deliverOtp, resolveOtpDelivery } from "./sms.service.js";

export function isProfileComplete(artisan) {
  return Boolean(
    artisan?.name?.trim() &&
      artisan?.location?.trim() &&
      artisan?.craftSpecialization?.trim(),
  );
}

export function createAuthService({
  config = env,
  delivery = deliverOtp,
  deliveryResolver = resolveOtpDelivery,
  now = () => new Date(),
  otpGenerator = generateOtp,
  repository = authRepository,
} = {}) {
  function assertOtpConfigured() {
    if (!config.otpHashSecret || config.otpHashSecret.length < 32) {
      throw new ApiError(503, "OTP security is not configured", {
        code: "OTP_NOT_CONFIGURED",
      });
    }
  }

  return {
    async sendOtp(phone) {
      assertOtpConfigured();
      const mode = deliveryResolver(phone, config);
      const currentTime = now();
      const existing = await repository.getChallenge(phone);
      const blocksResend =
        existing &&
        (!existing.consumedAt || existing.deliveryStatus === "failed");
      if (
        !config.otpLimitsDisabled &&
        existing?.resendAvailableAt > currentTime &&
        blocksResend
      ) {
        const retryAfterSeconds = Math.ceil(
          (existing.resendAvailableAt.getTime() - currentTime.getTime()) / 1000,
        );
        throw new ApiError(429, "Please wait before requesting another OTP", {
          code: "OTP_RESEND_COOLDOWN",
          details: [{ retryAfterSeconds }],
        });
      }

      const otp = otpGenerator();
      const otpSalt = createOtpSalt();
      const otpHash = hashOtp({
        otp,
        phone,
        salt: otpSalt,
        secret: config.otpHashSecret,
      });
      const expiresAt = new Date(
        currentTime.getTime() + config.otpExpirySeconds * 1000,
      );
      const resendAvailableAt = new Date(
        currentTime.getTime() +
          (config.otpLimitsDisabled ? 0 : config.otpResendCooldownSeconds * 1000),
      );

      await repository.saveChallenge(phone, {
        expiresAt,
        otpHash,
        otpSalt,
        resendAvailableAt,
      });

      let deliveryResult;
      try {
        deliveryResult = await delivery({ mode, otp, phone });
      } catch (error) {
        if (error?.deliveryOutcome !== "uncertain") {
          const retrySeconds = Math.max(
            config.otpResendCooldownSeconds,
            error?.retryAfterSeconds ?? 0,
          );
          const failedAt = now();
          const retryAt = new Date(failedAt.getTime() + retrySeconds * 1000);
          const failureExpiresAt = new Date(
            Math.max(expiresAt.getTime(), retryAt.getTime()),
          );
          if (repository.markDeliveryFailed) {
            await repository.markDeliveryFailed(phone, {
              expiresAt: failureExpiresAt,
              failedAt,
              resendAvailableAt: retryAt,
            });
          } else {
            await repository.invalidateChallenge(phone);
          }
        }
        throw error;
      }

      if (repository.markDeliveryAccepted) {
        await repository.markDeliveryAccepted(phone);
      }

      return {
        demoOtp: mode === "test" ? deliveryResult.demoOtp : undefined,
        expiresInSeconds: config.otpExpirySeconds,
        phone,
        resendAfterSeconds: config.otpLimitsDisabled
          ? 0
          : config.otpResendCooldownSeconds,
      };
    },

    async verifyOtp(phone, otp) {
      assertOtpConfigured();
      const currentTime = now();
      const challenge = await repository.getChallenge(phone);
      if (!challenge || challenge.consumedAt) {
        throw new ApiError(401, "OTP is invalid or no longer available", {
          code: "OTP_INVALID_OR_EXPIRED",
        });
      }
      if (challenge.expiresAt <= currentTime) {
        await repository.invalidateChallenge(phone);
        throw new ApiError(401, "OTP has expired", { code: "OTP_EXPIRED" });
      }
      if (
        !config.otpLimitsDisabled &&
        challenge.attempts >= config.otpMaxAttempts
      ) {
        throw new ApiError(429, "Maximum OTP attempts exceeded", {
          code: "OTP_ATTEMPTS_EXCEEDED",
        });
      }

      const valid = otpMatches({
        candidate: otp,
        expectedHash: challenge.otpHash,
        phone,
        salt: challenge.otpSalt,
        secret: config.otpHashSecret,
      });
      if (!valid) {
        const updatedChallenge = await repository.recordFailedAttempt(
          challenge._id,
          config.otpLimitsDisabled
            ? Number.MAX_SAFE_INTEGER
            : config.otpMaxAttempts,
        );
        if (config.otpLimitsDisabled) {
          throw new ApiError(401, "OTP is incorrect", {
            code: "OTP_INCORRECT",
          });
        }
        const attemptsRemaining = Math.max(
          0,
          config.otpMaxAttempts -
            (updatedChallenge?.attempts ?? config.otpMaxAttempts),
        );
        if (attemptsRemaining === 0) {
          throw new ApiError(429, "Maximum OTP attempts exceeded", {
            code: "OTP_ATTEMPTS_EXCEEDED",
          });
        }
        throw new ApiError(401, "OTP is incorrect", {
          code: "OTP_INCORRECT",
          details: [{ attemptsRemaining }],
        });
      }

      const consumed = await repository.consumeChallenge(
        challenge._id,
        currentTime,
      );
      if (!consumed) {
        throw new ApiError(401, "OTP is invalid or no longer available", {
          code: "OTP_INVALID_OR_EXPIRED",
        });
      }
      const result = await repository.findOrCreateArtisan(phone, currentTime);
      return {
        ...result,
        profileComplete: isProfileComplete(result.artisan),
      };
    },

    async logout(artisanId) {
      if (artisanId) await repository.incrementSessionVersion(artisanId);
    },
  };
}

export const authService = createAuthService();
