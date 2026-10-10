import { createHash } from "node:crypto";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

const CACHE_TTL_MS = 5 * 60 * 1000;
const responseCache = new Map();

function cacheKey(artisanId, path, body) {
  return createHash("sha256")
    .update(`${artisanId}:${path}:${JSON.stringify(body)}`)
    .digest("hex");
}

function serviceError(status, payload) {
  const providerError = payload?.error;
  if (providerError?.code && providerError?.message) {
    return new ApiError(status, providerError.message, {
      code: providerError.code,
    });
  }
  if (status === 429) return new ApiError(429, "AI usage limit reached. Please try again later.", { code: "AI_RATE_LIMITED" });
  if (status === 504) return new ApiError(504, "AI analysis timed out. You can continue manually.", { code: "AI_TIMEOUT" });
  if (status === 400 || status === 415 || status === 422) return new ApiError(422, "AI analysis input is invalid", { code: "AI_INPUT_INVALID" });
  if (status === 503) return new ApiError(503, "AI analysis is not configured or temporarily unavailable", { code: "AI_UNAVAILABLE" });
  return new ApiError(502, "AI analysis failed. You can continue manually.", { code: "AI_SERVICE_ERROR" });
}

export async function requestAiAnalysis(
  artisanId,
  path,
  body,
  { config = env, fetchImpl = globalThis.fetch, now = Date.now } = {},
) {
  if (!config.aiServiceUrl || !config.internalApiKey) {
    throw new ApiError(503, "AI service is not configured", { code: "AI_NOT_CONFIGURED" });
  }
  const key = cacheKey(artisanId, path, body);
  const cached = responseCache.get(key);
  if (cached && cached.expiresAt > now()) return cached.data;
  if (cached) responseCache.delete(key);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.aiRequestTimeoutMs);
  let response;
  try {
    response = await fetchImpl(`${config.aiServiceUrl.replace(/\/$/, "")}${path}`, {
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Internal-API-Key": config.internalApiKey,
      },
      method: "POST",
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (controller.signal.aborted || error?.name === "AbortError") {
      throw serviceError(504);
    }
    throw serviceError(502);
  }
  clearTimeout(timeoutId);

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw serviceError(response.status);
  }
  if (!response.ok || payload?.success !== true || !payload.data) {
    throw serviceError(response.status, payload);
  }
  responseCache.set(key, { data: payload.data, expiresAt: now() + CACHE_TTL_MS });
  if (responseCache.size > 100) responseCache.delete(responseCache.keys().next().value);
  return payload.data;
}
