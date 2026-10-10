import { ApiError } from "../../utils/ApiError.js";
import { sendSuccess } from "../../utils/response.js";
import { requestAiAnalysis } from "./ai.service.js";
import { SUPPORTED_AI_LANGUAGES } from "./ai.validation.js";

export async function analyzeProduct(request, response) {
  const result = await requestAiAnalysis(
    request.auth.artisanId,
    "/api/product-analysis",
    request.validated.body,
  );
  return sendSuccess(response, { data: result });
}

export async function analyzeMakingProcess(request, response) {
  const result = await requestAiAnalysis(
    request.auth.artisanId,
    "/api/making-process-analysis",
    request.validated.body,
  );
  return sendSuccess(response, { data: result });
}

export async function transcribeVoice(request, response) {
  let audioBase64 = "";
  let mimeType = "audio/webm";

  if (request.file) {
    audioBase64 = request.file.buffer.toString("base64");
    mimeType = request.file.mimetype || "audio/webm";
  } else if (request.body?.audioBase64 || request.body?.audio_base64) {
    audioBase64 = request.body.audioBase64 || request.body.audio_base64;
    mimeType = request.body.mimeType || request.body.mime_type || "audio/webm";
  }

  if (!audioBase64 || typeof audioBase64 !== "string") {
    throw new ApiError(400, "Audio recording is required", { code: "AUDIO_REQUIRED" });
  }

  const rawLanguage = (request.body?.language || "hi").trim().toLowerCase();
  const language = SUPPORTED_AI_LANGUAGES.has(rawLanguage) ? rawLanguage : "hi";

  const result = await requestAiAnalysis(
    request.auth.artisanId,
    "/api/voice-transcription",
    {
      audio_base64: audioBase64,
      mime_type: mimeType,
      language,
    },
  );

  return sendSuccess(response, {
    data: {
      transcript: result.transcript ?? "",
      language: result.language ?? language,
      sourceFormat: result.source_format ?? mimeType,
    },
  });
}

export async function translateText(request, response) {
  const { text, sourceLanguage, targetLanguage } = request.validated.body;

  const result = await requestAiAnalysis(
    request.auth.artisanId,
    "/api/translation",
    {
      text,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    },
  );

  return sendSuccess(response, {
    data: {
      translatedText: result.translated_text ?? "",
      sourceLanguage: result.source_language ?? sourceLanguage,
      targetLanguage: result.target_language ?? targetLanguage,
    },
  });
}
