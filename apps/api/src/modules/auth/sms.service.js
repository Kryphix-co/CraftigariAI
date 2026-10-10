import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import { normalizeIndianPhone } from "./auth.crypto.js";

const START_MESSAGING_ENDPOINT = "https://api.startmessaging.com/otp/send";
const START_MESSAGING_PROVIDER = "startmessaging";
const PROVIDER_TIMEOUT_MS = 8000;

function providerError(
  statusCode,
  message,
  { code, deliveryOutcome = "confirmed-failure", details, retryAfterSeconds } = {},
) {
  const error = new ApiError(statusCode, message, { code, details });
  error.deliveryOutcome = deliveryOutcome;
  error.retryAfterSeconds = retryAfterSeconds;
  return error;
}

function retryAfterSeconds(response, fallbackSeconds, now = Date.now()) {
  const value = response.headers.get("retry-after");
  if (!value) return fallbackSeconds;

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);

  const retryAt = Date.parse(value);
  if (!Number.isNaN(retryAt)) {
    return Math.max(1, Math.ceil((retryAt - now) / 1000));
  }
  return fallbackSeconds;
}

function isValidAcceptedResponse(response, payload) {
  if (!response.ok || !payload || typeof payload !== "object") return false;
  if (payload.success === false || payload.data?.success === false) return false;

  const declaredStatusCode = Number(payload.statusCode);
  if (
    Number.isFinite(declaredStatusCode) &&
    (declaredStatusCode < 200 || declaredStatusCode >= 300)
  ) {
    return false;
  }

  const providerStatus = String(
    payload.data?.status ?? payload.status ?? "",
  ).toLowerCase();
  return !["failed", "rejected", "error", "cancelled"].includes(
    providerStatus,
  );
}

function optionalProviderString(...values) {
  return values.find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
}

export function resolveOtpDelivery(phone, config = env) {
  if (config.otpTestModeRequested) {
    if (config.nodeEnv === "production") {
      throw new ApiError(503, "OTP test mode is forbidden in production", {
        code: "OTP_TEST_MODE_FORBIDDEN",
      });
    }
    const whitelist = new Set(
      config.otpTestPhoneNumbers.map(normalizeIndianPhone).filter(Boolean),
    );
    if (whitelist.has(phone)) return "test";
  }

  if (!config.otpProvider) {
    throw new ApiError(503, "SMS delivery is not configured", {
      code: "SMS_PROVIDER_NOT_CONFIGURED",
    });
  }
  if (config.otpProvider !== START_MESSAGING_PROVIDER) {
    throw new ApiError(501, "The configured SMS provider is not implemented", {
      code: "SMS_PROVIDER_NOT_IMPLEMENTED",
    });
  }
  if (!config.otpApiKey) {
    throw new ApiError(503, "SMS provider credentials are not configured", {
      code: "OTP_PROVIDER_NOT_CONFIGURED",
    });
  }
  return START_MESSAGING_PROVIDER;
}

export async function sendStartMessagingOtp(
  { otp, phone },
  {
    config = env,
    fetchImpl = globalThis.fetch,
    timeoutMs = PROVIDER_TIMEOUT_MS,
  } = {},
) {
  if (normalizeIndianPhone(phone) !== phone) {
    throw new ApiError(400, "A valid Indian mobile number is required", {
      code: "INVALID_PHONE",
    });
  }
  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(500, "Generated OTP is invalid", {
      code: "OTP_GENERATION_ERROR",
    });
  }
  if (!config.otpApiKey) {
    throw new ApiError(503, "SMS provider credentials are not configured", {
      code: "OTP_PROVIDER_NOT_CONFIGURED",
    });
  }
  if (typeof fetchImpl !== "function") {
    throw new ApiError(503, "SMS delivery is unavailable", {
      code: "OTP_PROVIDER_UNAVAILABLE",
    });
  }

  const fallbackRetrySeconds = config.otpResendCooldownSeconds ?? 60;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let response;

  try {
    response = await fetchImpl(START_MESSAGING_ENDPOINT, {
      body: JSON.stringify({
        phoneNumber: phone,
        variables: { appName: "Craftigari", otp },
      }),
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": config.otpApiKey,
      },
      method: "POST",
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    const timedOut = controller.signal.aborted || error?.name === "AbortError";
    throw providerError(
      timedOut ? 504 : 503,
      timedOut
        ? "SMS provider request timed out"
        : "SMS provider is temporarily unavailable",
      {
        code: timedOut ? "OTP_PROVIDER_TIMEOUT" : "OTP_PROVIDER_UNAVAILABLE",
        deliveryOutcome: "uncertain",
        details: [{ retryAfterSeconds: fallbackRetrySeconds }],
        retryAfterSeconds: fallbackRetrySeconds,
      },
    );
  }

  if (!response.ok) {
    clearTimeout(timeoutId);
    const isRateLimited = response.status === 429;
    const retrySeconds = Math.max(
      fallbackRetrySeconds,
      retryAfterSeconds(response, fallbackRetrySeconds),
    );
    throw providerError(
      isRateLimited ? 429 : 502,
      isRateLimited
        ? "SMS provider rate limit reached. Please try again later."
        : "SMS provider rejected the request",
      {
        code: isRateLimited
          ? "OTP_PROVIDER_RATE_LIMITED"
          : "OTP_PROVIDER_REJECTED",
        details: [{ retryAfterSeconds: retrySeconds }],
        retryAfterSeconds: retrySeconds,
      },
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    const timedOut = controller.signal.aborted || error?.name === "AbortError";
    throw providerError(
      timedOut ? 504 : 502,
      timedOut
        ? "SMS provider request timed out"
        : "SMS provider returned an invalid response",
      {
        code: timedOut
          ? "OTP_PROVIDER_TIMEOUT"
          : "OTP_PROVIDER_INVALID_RESPONSE",
        deliveryOutcome: "uncertain",
        details: [{ retryAfterSeconds: fallbackRetrySeconds }],
        retryAfterSeconds: fallbackRetrySeconds,
      },
    );
  }

  if (!isValidAcceptedResponse(response, payload)) {
    clearTimeout(timeoutId);
    throw providerError(502, "SMS provider returned an invalid response", {
      code: "OTP_PROVIDER_INVALID_RESPONSE",
      deliveryOutcome: "uncertain",
      details: [{ retryAfterSeconds: fallbackRetrySeconds }],
      retryAfterSeconds: fallbackRetrySeconds,
    });
  }

  clearTimeout(timeoutId);
  const providerData =
    payload.data && typeof payload.data === "object" ? payload.data : {};
  return {
    accepted: true,
    messageId: optionalProviderString(
      providerData.messageId,
      payload.messageId,
    ),
    mode: START_MESSAGING_PROVIDER,
    otpRequestId: optionalProviderString(
      providerData.otpRequestId,
      providerData.requestId,
      payload.otpRequestId,
    ),
    requestId: optionalProviderString(
      payload.requestId,
      providerData.requestId,
    ),
    status:
      optionalProviderString(providerData.status, payload.status) ?? "accepted",
  };
}

export async function deliverOtp(input, dependencies) {
  const { mode, otp, phone } = input;
  if (mode === "test") return { demoOtp: otp, mode };
  if (mode === START_MESSAGING_PROVIDER) {
    return sendStartMessagingOtp({ otp, phone }, dependencies);
  }
  throw new ApiError(501, "The configured SMS provider is not implemented", {
    code: "SMS_PROVIDER_NOT_IMPLEMENTED",
  });
}
