import assert from "node:assert/strict";
import { after, before, test } from "node:test";

process.env.CORS_ALLOWED_ORIGINS = "http://allowed.test";
process.env.INTERNAL_API_KEY = "";
process.env.MONGODB_URI = "";
process.env.OTP_HASH_SECRET = "o".repeat(32);
process.env.OTP_PROVIDER = "";
process.env.OTP_TEST_MODE = "false";
process.env.SESSION_SECRET = "s".repeat(32);

const { createApp } = await import("../src/app.js");
const { Product } = await import("../src/modules/products/product.model.js");
const { validateCreateProduct } = await import(
  "../src/modules/products/product.validation.js"
);
const { validatePagination } = await import(
  "../src/modules/products/product.validation.js"
);

let baseUrl;
let server;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("GET /health preserves the existing health response", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("CORS allows a configured frontend origin", async () => {
  const response = await fetch(`${baseUrl}/health`, {
    headers: { Origin: "http://allowed.test" },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "http://allowed.test");
  assert.equal(response.headers.get("access-control-allow-credentials"), "true");
});

test("CORS rejects an unconfigured browser origin consistently", async () => {
  const response = await fetch(`${baseUrl}/health`, {
    headers: { Origin: "http://blocked.test" },
  });
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), {
    success: false,
    error: {
      code: "CORS_ORIGIN_DENIED",
      message: "Origin is not allowed",
    },
  });
});

test("protected product routes reject requests without a session", async () => {
  const response = await fetch(`${baseUrl}/api/products`, {
    body: JSON.stringify({ title: "Draft" }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {
    success: false,
    error: {
      code: "UNAUTHORIZED",
      message: "Authentication is required",
    },
  });
});

test("image uploads reject unauthenticated requests before processing files", async () => {
  const formData = new FormData();
  formData.append("images", new Blob(["not-an-image"]), "image.jpg");
  const response = await fetch(`${baseUrl}/api/uploads/images`, {
    body: formData,
    method: "POST",
  });
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, "UNAUTHORIZED");
});

test("AI analysis rejects unauthenticated requests before proxying", async () => {
  const response = await fetch(`${baseUrl}/api/ai/product-analysis`, {
    body: JSON.stringify({ imageUrls: [] }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, "UNAUTHORIZED");

  const voiceResponse = await fetch(`${baseUrl}/api/ai/voice-transcription`, {
    body: JSON.stringify({ language: "hi" }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  assert.equal(voiceResponse.status, 401);
  assert.equal((await voiceResponse.json()).error.code, "UNAUTHORIZED");

  const translateResponse = await fetch(`${baseUrl}/api/ai/translate`, {
    body: JSON.stringify({ text: "test", sourceLanguage: "hi", targetLanguage: "en" }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  assert.equal(translateResponse.status, 401);
  assert.equal((await translateResponse.json()).error.code, "UNAUTHORIZED");
});

test("OTP sending fails clearly when no SMS delivery mode is configured", async () => {
  const response = await fetch(`${baseUrl}/api/auth/send-otp`, {
    body: JSON.stringify({ phone: "+919876543210" }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    success: false,
    error: {
      code: "SMS_PROVIDER_NOT_CONFIGURED",
      message: "SMS delivery is not configured",
    },
  });
});

test("authentication and profile endpoints reject missing sessions", async () => {
  for (const path of ["/api/auth/me", "/api/artisans/me"]) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 401);
    assert.equal((await response.json()).error.code, "UNAUTHORIZED");
  }
});

test("logout clears the session cookie even when already logged out", async () => {
  const response = await fetch(`${baseUrl}/api/auth/logout`, { method: "POST" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /craftigari_session=;/);
});

test("database routes return a service error when MongoDB is not configured", async () => {
  const response = await fetch(`${baseUrl}/api/products`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    success: false,
    error: {
      code: "DATABASE_NOT_CONFIGURED",
      message: "Database is not configured",
    },
  });
});

test("making process remains optional for a publishable product", async () => {
  const product = new Product({
    artisan: "507f1f77bcf86cd799439011",
    category: "Pottery",
    craftType: "Terracotta",
    description: "Hand-shaped and kiln-fired water vessel.",
    images: ["https://example.test/product.jpg"],
    makingProcess: [],
    materials: ["Clay"],
    price: 1200,
    productId: "test-product",
    title: "Terracotta water vessel",
  });
  await product.validate();
  assert.deepEqual(product.getPublishValidationErrors(), []);
});

test("product validation accepts frontend-friendly material and process image aliases", () => {
  const result = validateCreateProduct({
    material: "Clay",
    makingProcess: [
      {
        id: "raw-material",
        image: "https://example.test/raw-material.jpg",
        title: "Raw Material",
      },
    ],
  });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.value.materials, ["Clay"]);
  assert.equal(
    result.value.makingProcess[0].imageUrl,
    "https://example.test/raw-material.jpg",
  );
});

test("public catalog validates the optional artisan filter", () => {
  const valid = validatePagination(
    { artisanId: "507f1f77bcf86cd799439011", limit: "100" },
    { allowArtisan: true },
  );
  assert.deepEqual(valid.errors, []);
  assert.equal(valid.value.artisanId, "507f1f77bcf86cd799439011");

  const invalid = validatePagination(
    { artisanId: "not-an-artisan" },
    { allowArtisan: true },
  );
  assert.equal(invalid.errors[0].field, "artisanId");
});

test("unknown routes use the centralized JSON error shape", async () => {
  const response = await fetch(`${baseUrl}/missing`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Route not found: GET /missing",
    },
  });
});
