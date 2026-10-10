import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const rootEnvPath = fileURLToPath(new URL("../../../../.env", import.meta.url));
dotenv.config({ path: rootEnvPath, quiet: true });

function parsePort(value, fallback) {
  const port = Number(value ?? fallback);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  return port;
}

function parsePositiveInteger(value, fallback, name) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function parseOrigins(value) {
  return (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error("Boolean environment variables must be true or false");
}

function parseSameSite(value) {
  const sameSite = (value ?? "lax").toLowerCase();
  if (!["lax", "strict", "none"].includes(sameSite)) {
    throw new Error("COOKIE_SAME_SITE must be lax, strict, or none");
  }
  return sameSite;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT, 4000),
  mongodbUri: process.env.MONGODB_URI?.trim() ?? "",
  mongodbServerSelectionTimeoutMs: parsePositiveInteger(
    process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
    5000,
    "MONGODB_SERVER_SELECTION_TIMEOUT_MS",
  ),
  corsAllowedOrigins: parseOrigins(process.env.CORS_ALLOWED_ORIGINS),
  internalApiKey: process.env.INTERNAL_API_KEY ?? "",
  jsonBodyLimit: process.env.JSON_BODY_LIMIT?.trim() || "1mb",
  sessionSecret: process.env.SESSION_SECRET ?? "",
  authCookieName:
    process.env.AUTH_COOKIE_NAME?.trim() || "craftigari_session",
  sessionTtlHours: parsePositiveInteger(
    process.env.SESSION_TTL_HOURS,
    168,
    "SESSION_TTL_HOURS",
  ),
  cookieSecure: parseBoolean(
    process.env.COOKIE_SECURE,
    process.env.NODE_ENV === "production",
  ),
  cookieSameSite: parseSameSite(process.env.COOKIE_SAME_SITE),
  cookieDomain: process.env.COOKIE_DOMAIN?.trim() || undefined,
  otpHashSecret: process.env.OTP_HASH_SECRET ?? "",
  otpExpirySeconds: parsePositiveInteger(
    process.env.OTP_EXPIRY_SECONDS,
    300,
    "OTP_EXPIRY_SECONDS",
  ),
  otpResendCooldownSeconds: parsePositiveInteger(
    process.env.OTP_RESEND_COOLDOWN_SECONDS,
    60,
    "OTP_RESEND_COOLDOWN_SECONDS",
  ),
  otpMaxAttempts: parsePositiveInteger(
    process.env.OTP_MAX_ATTEMPTS,
    5,
    "OTP_MAX_ATTEMPTS",
  ),
  otpLimitsDisabled:
    process.env.NODE_ENV !== "production" &&
    parseBoolean(process.env.OTP_DISABLE_LIMITS),
  otpProvider: process.env.OTP_PROVIDER?.trim().toLowerCase() || "",
  otpApiKey: process.env.OTP_API_KEY?.trim() || "",
  otpTestModeRequested: parseBoolean(process.env.OTP_TEST_MODE),
  otpTestPhoneNumbers: parseOrigins(process.env.OTP_TEST_PHONE_NUMBERS),
  authRateLimitWindowMs: parsePositiveInteger(
    process.env.AUTH_RATE_LIMIT_WINDOW_MS,
    900000,
    "AUTH_RATE_LIMIT_WINDOW_MS",
  ),
  authRateLimitMax: parsePositiveInteger(
    process.env.AUTH_RATE_LIMIT_MAX,
    30,
    "AUTH_RATE_LIMIT_MAX",
  ),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim() || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY?.trim() || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET?.trim() || "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID?.trim() || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET?.trim() || "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET?.trim() || "",
  aiServiceUrl: process.env.AI_SERVICE_URL?.trim() || "",
  aiRequestTimeoutMs: parsePositiveInteger(
    process.env.AI_REQUEST_TIMEOUT_MS,
    40000,
    "AI_REQUEST_TIMEOUT_MS",
  ),
};
