import assert from "node:assert/strict";
import { test } from "node:test";
import { createArtisanSessionMiddleware, requireArtisanOwnership } from "../src/middleware/auth.js";
import { createRateLimiter } from "../src/middleware/rateLimit.js";
import { validateProfileUpdate } from "../src/modules/artisans/artisan.validation.js";
import { createArtisanService } from "../src/modules/artisans/artisan.service.js";
import { createAuthService } from "../src/modules/auth/auth.service.js";
import { normalizeIndianPhone } from "../src/modules/auth/auth.crypto.js";
import {
  createSessionToken,
  verifySessionToken,
} from "../src/modules/auth/session.js";
import { resolveOtpDelivery } from "../src/modules/auth/sms.service.js";

const PHONE = "+919876543210";
const ARTISAN_ID = "507f1f77bcf86cd799439011";

function config(overrides = {}) {
  return {
    authCookieName: "craftigari_session",
    cookieSameSite: "lax",
    cookieSecure: false,
    nodeEnv: "development",
    otpExpirySeconds: 300,
    otpHashSecret: "o".repeat(32),
    otpLimitsDisabled: false,
    otpMaxAttempts: 3,
    otpApiKey: "",
    otpProvider: "",
    otpResendCooldownSeconds: 60,
    otpTestModeRequested: true,
    otpTestPhoneNumbers: [PHONE],
    sessionSecret: "s".repeat(32),
    sessionTtlHours: 24,
    ...overrides,
  };
}

function createMemoryRepository() {
  let challenge = null;
  let nextArtisanId = 1;
  const artisans = new Map();

  return {
    state: { artisans, get challenge() { return challenge; } },
    async getChallenge(phone) {
      return challenge?.phone === phone ? challenge : null;
    },
    async saveChallenge(phone, values) {
      challenge = {
        _id: `challenge-${phone}`,
        attempts: 0,
        consumedAt: null,
        deliveryStatus: "pending",
        phone,
        ...values,
      };
      return challenge;
    },
    async markDeliveryAccepted(phone) {
      if (challenge?.phone === phone && !challenge.consumedAt) {
        challenge.deliveryStatus = "accepted";
      }
      return challenge;
    },
    async markDeliveryFailed(phone, values) {
      if (challenge?.phone === phone && !challenge.consumedAt) {
        challenge.consumedAt = values.failedAt;
        challenge.deliveryStatus = "failed";
        challenge.expiresAt = values.expiresAt;
        challenge.resendAvailableAt = values.resendAvailableAt;
      }
      return challenge;
    },
    async invalidateChallenge(phone) {
      if (challenge?.phone === phone) challenge = null;
    },
    async recordFailedAttempt(challengeId, maxAttempts) {
      if (
        challenge?._id !== challengeId ||
        challenge.consumedAt ||
        challenge.attempts >= maxAttempts
      ) {
        return null;
      }
      challenge.attempts += 1;
      return challenge;
    },
    async consumeChallenge(challengeId, consumedAt) {
      if (challenge?._id !== challengeId || challenge.consumedAt) return null;
      challenge.consumedAt = consumedAt;
      return challenge;
    },
    async findOrCreateArtisan(phone) {
      const existing = artisans.get(phone);
      if (existing) return { artisan: existing, isNewArtisan: false };
      const artisan = {
        _id: ARTISAN_ID.replace(/1$/, String(nextArtisanId++)),
        authSessionVersion: 0,
        bio: "",
        craftSpecialization: "",
        location: "",
        name: "",
        phone,
      };
      artisans.set(phone, artisan);
      return { artisan, isNewArtisan: true };
    },
    async incrementSessionVersion(artisanId) {
      const artisan = [...artisans.values()].find(
        (item) => item._id === artisanId,
      );
      if (artisan) artisan.authSessionVersion += 1;
      return artisan;
    },
  };
}

function createTestService(repository, now) {
  return createAuthService({
    config: config(),
    delivery: async ({ mode, otp }) => ({ demoOtp: otp, mode }),
    now,
    otpGenerator: () => "123456",
    repository,
  });
}

test("OTP generation stores only a hash and enforces resend cooldown", async () => {
  const repository = createMemoryRepository();
  const now = () => new Date("2026-01-01T00:00:00.000Z");
  const service = createTestService(repository, now);
  const result = await service.sendOtp(PHONE);

  assert.equal(result.demoOtp, "123456");
  assert.notEqual(repository.state.challenge.otpHash, "123456");
  assert.equal("otp" in repository.state.challenge, false);
  await assert.rejects(
    () => service.sendOtp(PHONE),
    (error) => error.code === "OTP_RESEND_COOLDOWN",
  );
});

test("confirmed delivery failures invalidate the OTP and retain retry cooldown", async () => {
  const repository = createMemoryRepository();
  const deliveryError = new Error("provider details must stay internal");
  deliveryError.deliveryOutcome = "confirmed-failure";
  deliveryError.retryAfterSeconds = 120;
  const service = createAuthService({
    config: config({ otpResendCooldownSeconds: 60 }),
    delivery: async () => {
      throw deliveryError;
    },
    deliveryResolver: () => "startmessaging",
    now: () => new Date("2026-01-01T00:00:00.000Z"),
    otpGenerator: () => "123456",
    repository,
  });

  await assert.rejects(() => service.sendOtp(PHONE), deliveryError);
  assert.equal(repository.state.challenge.deliveryStatus, "failed");
  assert.notEqual(repository.state.challenge.consumedAt, null);
  await assert.rejects(
    () => service.verifyOtp(PHONE, "123456"),
    (error) => error.code === "OTP_INVALID_OR_EXPIRED",
  );
  await assert.rejects(
    () => service.sendOtp(PHONE),
    (error) =>
      error.code === "OTP_RESEND_COOLDOWN" &&
      error.details[0].retryAfterSeconds === 120,
  );
});

test("uncertain delivery keeps the OTP verifiable while cooldown prevents duplicates", async () => {
  const repository = createMemoryRepository();
  const deliveryError = new Error("network outcome unknown");
  deliveryError.deliveryOutcome = "uncertain";
  const service = createAuthService({
    config: config(),
    delivery: async () => {
      throw deliveryError;
    },
    deliveryResolver: () => "startmessaging",
    now: () => new Date("2026-01-01T00:00:00.000Z"),
    otpGenerator: () => "123456",
    repository,
  });

  await assert.rejects(() => service.sendOtp(PHONE), deliveryError);
  assert.equal(repository.state.challenge.deliveryStatus, "pending");
  assert.equal(repository.state.challenge.consumedAt, null);
  await assert.rejects(
    () => service.sendOtp(PHONE),
    (error) => error.code === "OTP_RESEND_COOLDOWN",
  );
  const verified = await service.verifyOtp(PHONE, "123456");
  assert.equal(verified.artisan.phone, PHONE);
});

test("Indian phone numbers are normalized and invalid numbers are rejected", () => {
  assert.equal(normalizeIndianPhone("98765 43210"), PHONE);
  assert.equal(normalizeIndianPhone("+91-98765-43210"), PHONE);
  assert.equal(normalizeIndianPhone("1234567890"), null);
  assert.equal(normalizeIndianPhone("987654321"), null);
});

test("OTP expiry and maximum wrong attempts are enforced", async () => {
  let currentTime = new Date("2026-01-01T00:00:00.000Z");
  const expiredRepository = createMemoryRepository();
  const expiredService = createTestService(expiredRepository, () => currentTime);
  await expiredService.sendOtp(PHONE);
  currentTime = new Date("2026-01-01T00:05:01.000Z");
  await assert.rejects(
    () => expiredService.verifyOtp(PHONE, "123456"),
    (error) => error.code === "OTP_EXPIRED",
  );

  const attemptsRepository = createMemoryRepository();
  const attemptsService = createTestService(
    attemptsRepository,
    () => new Date("2026-01-01T00:00:00.000Z"),
  );
  await attemptsService.sendOtp(PHONE);
  await assert.rejects(
    () => attemptsService.verifyOtp(PHONE, "000000"),
    (error) => error.code === "OTP_INCORRECT",
  );
  await assert.rejects(
    () => attemptsService.verifyOtp(PHONE, "000000"),
    (error) => error.code === "OTP_INCORRECT",
  );
  await assert.rejects(
    () => attemptsService.verifyOtp(PHONE, "000000"),
    (error) => error.code === "OTP_ATTEMPTS_EXCEEDED",
  );
});

test("development prototype mode removes app resend and wrong-attempt limits", async () => {
  const repository = createMemoryRepository();
  const service = createAuthService({
    config: config({ otpLimitsDisabled: true }),
    delivery: async ({ mode, otp }) => ({ demoOtp: otp, mode }),
    now: () => new Date("2026-01-01T00:00:00.000Z"),
    otpGenerator: () => "123456",
    repository,
  });

  const first = await service.sendOtp(PHONE);
  const second = await service.sendOtp(PHONE);
  assert.equal(first.resendAfterSeconds, 0);
  assert.equal(second.resendAfterSeconds, 0);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    await assert.rejects(
      () => service.verifyOtp(PHONE, "000000"),
      (error) => error.code === "OTP_INCORRECT",
    );
  }
  const verified = await service.verifyOtp(PHONE, "123456");
  assert.equal(verified.artisan.phone, PHONE);
});

test("OTP verification registers once and logs the existing artisan in later", async () => {
  const repository = createMemoryRepository();
  const service = createTestService(
    repository,
    () => new Date("2026-01-01T00:00:00.000Z"),
  );
  await service.sendOtp(PHONE);
  const registration = await service.verifyOtp(PHONE, "123456");
  assert.equal(registration.isNewArtisan, true);
  assert.equal(registration.artisan.phone, PHONE);

  await service.sendOtp(PHONE);
  const login = await service.verifyOtp(PHONE, "123456");
  assert.equal(login.isNewArtisan, false);
  assert.equal(repository.state.artisans.size, 1);
});

test("signed sessions persist identity and logout invalidates the old version", async () => {
  const repository = createMemoryRepository();
  const service = createTestService(
    repository,
    () => new Date("2026-01-01T00:00:00.000Z"),
  );
  await service.sendOtp(PHONE);
  const { artisan } = await service.verifyOtp(PHONE, "123456");
  const settings = config();
  const issuedAt = Date.now();
  const token = createSessionToken(
    { artisanId: artisan._id, sessionVersion: artisan.authSessionVersion },
    settings,
    issuedAt,
  );
  assert.equal(
    verifySessionToken(token, settings, issuedAt + 1000).sub,
    artisan._id,
  );

  const middleware = createArtisanSessionMiddleware({
    config: settings,
    findArtisan: async () => artisan,
  }).requireArtisanSession;
  const runMiddleware = () =>
    new Promise((resolve, reject) => {
      const request = { cookies: { [settings.authCookieName]: token } };
      middleware(request, {}, (error) =>
        error ? reject(error) : resolve(request.auth),
      );
    });
  assert.equal((await runMiddleware()).artisanId, artisan._id);

  await service.logout(artisan._id);
  await assert.rejects(
    runMiddleware,
    (error) => error.code === "INVALID_SESSION",
  );
});

test("profile validation excludes protected identity fields", () => {
  const accepted = validateProfileUpdate({
    bio: "Third-generation potter",
    craftSpecialization: "Terracotta",
    location: "Jaipur, Rajasthan",
    name: "Ram Singh",
    profilePhoto: "https://example.test/profile.jpg",
  });
  assert.deepEqual(accepted.errors, []);

  const rejected = validateProfileUpdate({ phone: "+919999999999" });
  assert.equal(rejected.errors[0].field, "phone");
});

test("authenticated profile updates persist only validated profile data", async () => {
  let saved;
  const service = createArtisanService({
    repository: {
      async updateProfile(artisanId, input) {
        saved = { _id: artisanId, phone: PHONE, ...input };
        return saved;
      },
    },
  });
  const validated = validateProfileUpdate({
    craftSpecialization: "Terracotta",
    location: "Jaipur",
    name: "Ram Singh",
  });
  const artisan = await service.updateProfile(ARTISAN_ID, validated.value);
  assert.equal(artisan._id, ARTISAN_ID);
  assert.equal(saved.name, "Ram Singh");
  assert.equal(saved.phone, PHONE);
});

test("cross-artisan product listing is denied", () => {
  let received;
  requireArtisanOwnership(
    {
      auth: { artisanId: ARTISAN_ID },
      validated: {
        params: { artisanId: "507f1f77bcf86cd799439099" },
      },
    },
    {},
    (error) => {
      received = error;
    },
  );
  assert.equal(received.code, "FORBIDDEN");
});

test("production rejects explicitly requested OTP test mode", () => {
  assert.throws(
    () =>
      resolveOtpDelivery(
        PHONE,
        config({ nodeEnv: "production", otpTestModeRequested: true }),
      ),
    (error) => error.code === "OTP_TEST_MODE_FORBIDDEN",
  );
});

test("authentication rate limiter rejects requests over its window limit", () => {
  const limiter = createRateLimiter({ max: 2, windowMs: 60000 });
  const request = { ip: "127.0.0.1" };
  const response = { set() {} };
  const errors = [];
  limiter(request, response, (error) => errors.push(error));
  limiter(request, response, (error) => errors.push(error));
  limiter(request, response, (error) => errors.push(error));
  assert.equal(errors[0], undefined);
  assert.equal(errors[1], undefined);
  assert.equal(errors[2].code, "RATE_LIMITED");
});
