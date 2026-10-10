import mongoose from "mongoose";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

function normalizeError(error) {
  if (error instanceof ApiError) return error;

  if (error instanceof mongoose.Error.ValidationError) {
    return new ApiError(400, "Database validation failed", {
      code: "VALIDATION_ERROR",
      details: Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return new ApiError(400, `Invalid value for ${error.path}`, {
      code: "INVALID_IDENTIFIER",
    });
  }

  if (error?.code === 11000) {
    return new ApiError(409, "A resource with this value already exists", {
      code: "DUPLICATE_RESOURCE",
      details: Object.keys(error.keyPattern ?? {}).map((field) => ({ field })),
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return new ApiError(400, "Request body contains invalid JSON", {
      code: "INVALID_JSON",
    });
  }

  if (error?.type === "entity.too.large") {
    return new ApiError(413, "Request body is too large", {
      code: "PAYLOAD_TOO_LARGE",
    });
  }

  return new ApiError(500, "Internal server error", {
    code: "INTERNAL_ERROR",
  });
}

export function notFoundHandler(request, _response, next) {
  next(
    new ApiError(404, `Route not found: ${request.method} ${request.path}`, {
      code: "ROUTE_NOT_FOUND",
    }),
  );
}

export function errorHandler(error, _request, response, next) {
  if (response.headersSent) return next(error);

  const normalized = normalizeError(error);
  const payload = {
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
    },
  };

  if (normalized.details !== undefined) {
    payload.error.details = normalized.details;
  }
  if (env.nodeEnv !== "production" && normalized.statusCode === 500) {
    payload.error.debug = error.message;
  }

  return response.status(normalized.statusCode).json(payload);
}
