const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

// Keep local development usable when the monorepo root env has not yet been
// picked up by a running Next.js process. Production still requires an
// explicit public API URL.
export const API_BASE_URL = (
  configuredApiBaseUrl ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "")
).replace(/\/$/, "");

export class ApiClientError extends Error {
  constructor(message, { code = "API_ERROR", details, status = 0 } = {}) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

function buildUrl(path) {
  if (!API_BASE_URL) {
    throw new ApiClientError(
      "Backend URL is not configured. Set NEXT_PUBLIC_API_URL.",
      { code: "API_NOT_CONFIGURED" },
    );
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request(path, { body, headers, method = "GET", signal } = {}) {
  let response;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  try {
    response = await fetch(buildUrl(path), {
      body:
        body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body === undefined || isFormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...headers,
      },
      method,
      signal,
    });
  } catch (error) {
    if (error instanceof ApiClientError || error.name === "AbortError") throw error;
    throw new ApiClientError(
      "Unable to reach the Craftigari server. Please try again.",
      { code: "NETWORK_ERROR" },
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new ApiClientError(
      payload?.error?.message || `Request failed with status ${response.status}`,
      {
        code: payload?.error?.code,
        details: payload?.error?.details,
        status: response.status,
      },
    );
  }

  if (!payload?.success) {
    throw new ApiClientError("The server returned an unexpected response", {
      code: "INVALID_API_RESPONSE",
      status: response.status,
    });
  }
  return payload.data;
}

export const apiGet = (path, options) => request(path, options);
export const apiPost = (path, body, options) =>
  request(path, { ...options, body, method: "POST" });
export const apiPatch = (path, body, options) =>
  request(path, { ...options, body, method: "PATCH" });
export const apiUpload = (path, formData, options) =>
  request(path, { ...options, body: formData, method: "POST" });
