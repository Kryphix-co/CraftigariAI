import { timingSafeEqual } from "node:crypto";
import { connectToDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { Artisan } from "../modules/artisans/artisan.model.js";
import { verifySessionToken } from "../modules/auth/session.js";

function safelyMatches(candidate, expected) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

export function requireInternalApiKey(request, _response, next) {
  if (!env.internalApiKey) {
    return next(
      new ApiError(503, "Internal authorization is not configured", {
        code: "INTERNAL_AUTH_NOT_CONFIGURED",
      }),
    );
  }
  const apiKey = request.get("x-api-key") ?? "";
  if (!apiKey || !safelyMatches(apiKey, env.internalApiKey)) {
    return next(
      new ApiError(401, "Valid internal credentials are required", {
        code: "UNAUTHORIZED",
      }),
    );
  }
  request.internalAuth = true;
  return next();
}

async function defaultFindArtisan(artisanId) {
  await connectToDatabase();
  return Artisan.findById(artisanId).select("+authSessionVersion");
}

export function createArtisanSessionMiddleware({
  config = env,
  findArtisan = defaultFindArtisan,
} = {}) {
  async function authenticate(request) {
    const token = request.cookies?.[config.authCookieName];
    if (!token) {
      throw new ApiError(401, "Authentication is required", {
        code: "UNAUTHORIZED",
      });
    }
    const payload = verifySessionToken(token, config);
    const artisan = await findArtisan(payload.sub);
    if (!artisan || artisan.authSessionVersion !== payload.sv) {
      throw new ApiError(401, "Authentication session is no longer valid", {
        code: "INVALID_SESSION",
      });
    }
    request.auth = {
      artisan,
      artisanId: String(artisan._id ?? artisan.id),
    };
  }

  return {
    requireArtisanSession(request, _response, next) {
      authenticate(request).then(() => next(), next);
    },
    optionalArtisanSession(request, _response, next) {
      if (!request.cookies?.[config.authCookieName]) return next();
      authenticate(request).then(() => next(), () => next());
    },
  };
}

export const { optionalArtisanSession, requireArtisanSession } =
  createArtisanSessionMiddleware();

export function requireArtisanOwnership(request, _response, next) {
  if (request.validated?.params?.artisanId !== request.auth?.artisanId) {
    return next(
      new ApiError(403, "This artisan resource is not available", {
        code: "FORBIDDEN",
      }),
    );
  }
  return next();
}
