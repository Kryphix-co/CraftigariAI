import assert from "node:assert/strict";
import { test } from "node:test";
import { requestAiAnalysis } from "../src/modules/ai/ai.service.js";
import {
  isTrustedCloudinaryUrl,
  validateProductAnalysis,
  validateTranslation,
  validateVoiceTranscription,
} from "../src/modules/ai/ai.validation.js";

const config = {
  aiRequestTimeoutMs: 100,
  aiServiceUrl: "http://ai.test",
  cloudinaryCloudName: "craftigari-cloud",
  internalApiKey: "internal-secret",
};

test("AI input accepts only the configured Cloudinary account", () => {
  assert.equal(
    isTrustedCloudinaryUrl(
      "https://res.cloudinary.com/craftigari-cloud/image/upload/c_limit,w_1600/product.jpg",
      config,
    ),
    true,
  );
  assert.equal(
    isTrustedCloudinaryUrl("https://example.com/product.jpg", config),
    false,
  );
  const invalid = validateProductAnalysis({ imageUrls: ["https://example.com/a.jpg"] });
  assert.equal(invalid.errors[0].field, "imageUrls.0");
});

test("AI proxy sends internal authorization and caches unchanged requests", async () => {
  let calls = 0;
  const fetchImpl = async (_url, options) => {
    calls += 1;
    assert.equal(options.headers["X-Internal-API-Key"], "internal-secret");
    return new Response(
      JSON.stringify({ success: true, data: { suggestions: { title: "Pot" } } }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  const body = { imageUrls: ["https://res.cloudinary.com/craftigari-cloud/image/upload/a.jpg"] };
  const first = await requestAiAnalysis("artisan-cache", "/api/product-analysis", body, { config, fetchImpl });
  const second = await requestAiAnalysis("artisan-cache", "/api/product-analysis", body, { config, fetchImpl });
  assert.equal(first.suggestions.title, "Pot");
  assert.deepEqual(second, first);
  assert.equal(calls, 1);
});

test("AI proxy sanitizes provider rate limits and missing configuration", async () => {
  await assert.rejects(
    () => requestAiAnalysis("artisan-rate", "/api/product-analysis", {}, {
      config,
      fetchImpl: async () => new Response(JSON.stringify({ success: false }), { status: 429 }),
    }),
    (error) => error.code === "AI_RATE_LIMITED" && error.statusCode === 429,
  );
  await assert.rejects(
    () => requestAiAnalysis("artisan-missing", "/api/product-analysis", {}, {
      config: { ...config, internalApiKey: "" },
    }),
    (error) => error.code === "AI_NOT_CONFIGURED",
  );
});

test("AI proxy preserves safe errors returned by the internal AI service", async () => {
  await assert.rejects(
    () => requestAiAnalysis("artisan-sarvam-error", "/api/voice-transcription", {}, {
      config,
      fetchImpl: async () => new Response(
        JSON.stringify({
          success: false,
          data: null,
          error: {
            code: "SARVAM_AUTH_FAILED",
            message: "Sarvam authorization failed. Invalid API key.",
          },
        }),
        { status: 503, headers: { "content-type": "application/json" } },
      ),
    }),
    (error) =>
      error.code === "SARVAM_AUTH_FAILED" &&
      error.statusCode === 503 &&
      error.message === "Sarvam authorization failed. Invalid API key.",
  );
});

test("Translation validation enforces required fields and supported languages", () => {
  const valid = validateTranslation({
    text: "सुंदर मिट्टी का घड़ा",
    sourceLanguage: "hi",
    targetLanguage: "en",
  });
  assert.equal(valid.errors.length, 0);
  assert.equal(valid.value.text, "सुंदर मिट्टी का घड़ा");
  assert.equal(valid.value.sourceLanguage, "hi");
  assert.equal(valid.value.targetLanguage, "en");

  const invalidLang = validateTranslation({
    text: "Hello",
    sourceLanguage: "french",
    targetLanguage: "german",
  });
  assert.equal(invalidLang.errors.length, 2);

  const missingText = validateTranslation({
    sourceLanguage: "hi",
    targetLanguage: "en",
  });
  assert.equal(missingText.errors[0].field, "text");
});

test("Voice transcription proxy passes audio and language to internal FastAPI", async () => {
  let calledUrl = "";
  let calledHeaders = {};
  let calledBody = null;

  const fetchImpl = async (url, options) => {
    calledUrl = url;
    calledHeaders = options.headers;
    calledBody = JSON.parse(options.body);
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          transcript: "हाथ से बनी वस्तु",
          language: "hi",
          source_format: "audio/webm",
        },
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };

  const payload = {
    audio_base64: "dGVzdC1hdWRpby1ieXRlcw==",
    mime_type: "audio/webm",
    language: "hi",
  };

  const result = await requestAiAnalysis(
    "artisan-voice-test",
    "/api/voice-transcription",
    payload,
    { config, fetchImpl },
  );

  assert.equal(calledUrl, "http://ai.test/api/voice-transcription");
  assert.equal(calledHeaders["X-Internal-API-Key"], "internal-secret");
  assert.equal(calledBody.language, "hi");
  assert.equal(result.transcript, "हाथ से बनी वस्तु");
});

test("Translation proxy passes text and language pairs to internal FastAPI", async () => {
  let calledUrl = "";
  let calledBody = null;

  const fetchImpl = async (url, options) => {
    calledUrl = url;
    calledBody = JSON.parse(options.body);
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          translated_text: "Terracotta clay pot",
          source_language: "hi",
          target_language: "en",
        },
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };

  const payload = {
    text: "मिट्टी का घड़ा",
    source_language: "hi",
    target_language: "en",
  };

  const result = await requestAiAnalysis(
    "artisan-translate-test",
    "/api/translation",
    payload,
    { config, fetchImpl },
  );

  assert.equal(calledUrl, "http://ai.test/api/translation");
  assert.equal(calledBody.text, "मिट्टी का घड़ा");
  assert.equal(result.translated_text, "Terracotta clay pot");
});
