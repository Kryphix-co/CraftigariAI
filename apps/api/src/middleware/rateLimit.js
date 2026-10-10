import { ApiError } from "../utils/ApiError.js";

export function createRateLimiter({ keyGenerator, max, windowMs }) {
  const entries = new Map();

  return (request, response, next) => {
    const now = Date.now();
    const key = keyGenerator?.(request) ?? request.ip ?? "unknown";
    let entry = entries.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      entries.set(key, entry);
    }
    entry.count += 1;

    const remaining = Math.max(0, max - entry.count);
    response.set("RateLimit-Limit", String(max));
    response.set("RateLimit-Remaining", String(remaining));
    response.set("RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((entry.resetAt - now) / 1000),
      );
      response.set("Retry-After", String(retryAfterSeconds));
      return next(
        new ApiError(429, "Too many authentication requests", {
          code: "RATE_LIMITED",
          details: [{ retryAfterSeconds }],
        }),
      );
    }

    if (entries.size > 10000) {
      for (const [entryKey, value] of entries) {
        if (value.resetAt <= now) entries.delete(entryKey);
      }
    }
    return next();
  };
}
