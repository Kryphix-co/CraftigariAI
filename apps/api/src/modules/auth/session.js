import { createHmac, timingSafeEqual } from "node:crypto";
import mongoose from "mongoose";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function assertSessionConfigured(config = env) {
  if (!config.sessionSecret || config.sessionSecret.length < 32) {
    throw new ApiError(503, "Authentication sessions are not configured", {
      code: "AUTH_NOT_CONFIGURED",
    });
  }
  if (config.cookieSameSite === "none" && !config.cookieSecure) {
    throw new ApiError(503, "Cross-site cookies require COOKIE_SECURE=true", {
      code: "AUTH_COOKIE_MISCONFIGURED",
    });
  }
}

export function createSessionToken(
  { artisanId, sessionVersion },
  config = env,
  now = Date.now(),
) {
  assertSessionConfigured(config);
  const issuedAt = Math.floor(now / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      sub: String(artisanId),
      sv: sessionVersion,
      iat: issuedAt,
      exp: issuedAt + config.sessionTtlHours * 60 * 60,
    }),
  ).toString("base64url");
  return `${payload}.${sign(payload, config.sessionSecret)}`;
}

export function verifySessionToken(token, config = env, now = Date.now()) {
  assertSessionConfigured(config);
  if (typeof token !== "string") {
    throw new ApiError(401, "Authentication is required", {
      code: "UNAUTHORIZED",
    });
  }

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) {
    throw new ApiError(401, "Invalid authentication session", {
      code: "INVALID_SESSION",
    });
  }
  const expected = Buffer.from(sign(payload, config.sessionSecret));
  const provided = Buffer.from(signature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    throw new ApiError(401, "Invalid authentication session", {
      code: "INVALID_SESSION",
    });
  }

  let decoded;
  try {
    decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new ApiError(401, "Invalid authentication session", {
      code: "INVALID_SESSION",
    });
  }

  const nowSeconds = Math.floor(now / 1000);
  if (
    !mongoose.isValidObjectId(decoded.sub) ||
    !Number.isInteger(decoded.sv) ||
    !Number.isInteger(decoded.exp) ||
    decoded.exp <= nowSeconds
  ) {
    throw new ApiError(401, "Authentication session has expired", {
      code: "SESSION_EXPIRED",
    });
  }
  return decoded;
}

export function getSessionCookieOptions(config = env) {
  assertSessionConfigured(config);
  return {
    domain: config.cookieDomain,
    httpOnly: true,
    maxAge: config.sessionTtlHours * 60 * 60 * 1000,
    path: "/",
    sameSite: config.cookieSameSite,
    secure: config.cookieSecure,
  };
}

export function getClearCookieOptions(config = env) {
  return {
    domain: config.cookieDomain,
    httpOnly: true,
    path: "/",
    sameSite: config.cookieSameSite,
    secure: config.cookieSecure,
  };
}
