import { env } from "../../config/env.js";

const LANGUAGES = new Set(["en", "hi"]);
const PRODUCT_FIELDS = new Set([
  "imageUrls",
  "transcript",
  "description",
  "language",
  "knownDetails",
]);
const KNOWN_FIELDS = new Set([
  "title",
  "description",
  "category",
  "craftType",
  "materials",
  "colours",
  "effort",
  "size",
  "answers",
]);

function plainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function addUnknownErrors(input, allowed, prefix, errors) {
  Object.keys(input).forEach((field) => {
    if (!allowed.has(field)) {
      errors.push({ field: prefix ? `${prefix}.${field}` : field, message: "Unknown field" });
    }
  });
}

function cleanString(value, field, errors, maxLength, fallback = "") {
  if (value === undefined) return fallback;
  if (typeof value !== "string") {
    errors.push({ field, message: "Must be a string" });
    return fallback;
  }
  const result = value.trim();
  if (result.length > maxLength) errors.push({ field, message: `Must be at most ${maxLength} characters` });
  return result;
}

function stringArray(value, field, errors, maxItems = 20) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > maxItems) {
    errors.push({ field, message: `Must be an array with at most ${maxItems} items` });
    return [];
  }
  return value
    .map((item, index) => cleanString(item, `${field}.${index}`, errors, 120))
    .filter(Boolean);
}

export function isTrustedCloudinaryUrl(value, config = env) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      !url.username &&
      !url.password &&
      !url.port &&
      Boolean(config.cloudinaryCloudName) &&
      url.pathname.startsWith(`/${config.cloudinaryCloudName}/image/upload/`)
    );
  } catch {
    return false;
  }
}

function imageUrls(value, field, errors, { min = 0, max = 3 } = {}) {
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    errors.push({ field, message: `Must contain ${min}-${max} trusted images` });
    return [];
  }
  return value.map((item, index) => {
    if (typeof item !== "string" || !isTrustedCloudinaryUrl(item)) {
      errors.push({ field: `${field}.${index}`, message: "Must be a Craftigari Cloudinary image URL" });
      return "";
    }
    return item;
  }).filter(Boolean);
}

function knownDetails(value, errors) {
  if (value === undefined) return {};
  if (!plainObject(value)) {
    errors.push({ field: "knownDetails", message: "Must be an object" });
    return {};
  }
  addUnknownErrors(value, KNOWN_FIELDS, "knownDetails", errors);
  const answers = {};
  if (value.answers !== undefined) {
    if (!plainObject(value.answers) || Object.keys(value.answers).length > 10) {
      errors.push({ field: "knownDetails.answers", message: "Must be an object with at most 10 answers" });
    } else {
      Object.entries(value.answers).forEach(([key, answer]) => {
        const cleaned = cleanString(answer, `knownDetails.answers.${key}`, errors, 500);
        if (cleaned) answers[key.slice(0, 80)] = cleaned;
      });
    }
  }
  return {
    title: cleanString(value.title, "knownDetails.title", errors, 160),
    description: cleanString(value.description, "knownDetails.description", errors, 5000),
    category: cleanString(value.category, "knownDetails.category", errors, 120),
    craftType: cleanString(value.craftType, "knownDetails.craftType", errors, 120),
    materials: stringArray(value.materials, "knownDetails.materials", errors),
    colours: stringArray(value.colours, "knownDetails.colours", errors),
    effort: cleanString(value.effort, "knownDetails.effort", errors, 500),
    size: cleanString(value.size, "knownDetails.size", errors, 120),
    answers,
  };
}

export function validateProductAnalysis(input) {
  const errors = [];
  if (!plainObject(input)) return { value: {}, errors: [{ field: "body", message: "Must be a JSON object" }] };
  addUnknownErrors(input, PRODUCT_FIELDS, "", errors);
  const language = input.language ?? "en";
  if (!LANGUAGES.has(language)) errors.push({ field: "language", message: "Must be en or hi" });
  return {
    value: {
      imageUrls: imageUrls(input.imageUrls, "imageUrls", errors, { min: 1, max: 3 }),
      transcript: cleanString(input.transcript, "transcript", errors, 5000),
      description: cleanString(input.description, "description", errors, 5000),
      language,
      knownDetails: knownDetails(input.knownDetails, errors),
    },
    errors,
  };
}

export function validateMakingProcessAnalysis(input) {
  const errors = [];
  if (!plainObject(input)) return { value: {}, errors: [{ field: "body", message: "Must be a JSON object" }] };
  const language = input.language ?? "en";
  if (!LANGUAGES.has(language)) errors.push({ field: "language", message: "Must be en or hi" });
  if (!Array.isArray(input.steps) || input.steps.length < 1 || input.steps.length > 5) {
    errors.push({ field: "steps", message: "Must contain 1-5 supplied process steps" });
  }
  const steps = Array.isArray(input.steps) ? input.steps.slice(0, 5).map((step, index) => {
    if (!plainObject(step)) {
      errors.push({ field: `steps.${index}`, message: "Must be an object" });
      return { id: `invalid-${index}`, title: "", description: "" };
    }
    const result = {
      id: cleanString(step.id, `steps.${index}.id`, errors, 100),
      title: cleanString(step.title, `steps.${index}.title`, errors, 120),
      description: cleanString(step.description, `steps.${index}.description`, errors, 2000),
    };
    if (step.imageUrl) {
      const urls = imageUrls([step.imageUrl], `steps.${index}.imageUrl`, errors, { min: 1, max: 1 });
      if (urls[0]) result.imageUrl = urls[0];
    }
    if (!result.id) errors.push({ field: `steps.${index}.id`, message: "Is required" });
    return result;
  }) : [];
  if (steps.length && !steps.some((step) => step.description || step.imageUrl)) {
    errors.push({ field: "steps", message: "At least one step needs a description or image" });
  }
  return { value: { language, steps }, errors };
}

export const SUPPORTED_AI_LANGUAGES = new Set([
  "hi", "en", "bn", "gu", "kn", "ml", "mr", "or", "pa", "ta", "te", "ur", "as"
]);

export function validateTranslation(input = {}) {
  const errors = [];
  if (!plainObject(input)) {
    return { value: null, errors: [{ field: "body", message: "Must be a JSON object" }] };
  }
  const text = cleanString(input.text, "text", errors, 5000);
  if (!text) errors.push({ field: "text", message: "Text to translate is required" });

  const sourceLanguage = (input.sourceLanguage ?? input.source_language ?? "").trim().toLowerCase();
  if (!SUPPORTED_AI_LANGUAGES.has(sourceLanguage)) {
    errors.push({ field: "sourceLanguage", message: `Unsupported source language: ${sourceLanguage}` });
  }

  const targetLanguage = (input.targetLanguage ?? input.target_language ?? "").trim().toLowerCase();
  if (!SUPPORTED_AI_LANGUAGES.has(targetLanguage)) {
    errors.push({ field: "targetLanguage", message: `Unsupported target language: ${targetLanguage}` });
  }

  return {
    value: { text, sourceLanguage, targetLanguage },
    errors,
  };
}

export function validateVoiceTranscription(input = {}) {
  const errors = [];
  if (!plainObject(input)) {
    return { value: null, errors: [{ field: "body", message: "Must be a JSON object" }] };
  }
  const language = (input.language ?? "hi").trim().toLowerCase();
  if (!SUPPORTED_AI_LANGUAGES.has(language)) {
    errors.push({ field: "language", message: `Unsupported language: ${language}` });
  }
  const audioBase64 = typeof input.audioBase64 === "string" ? input.audioBase64 : input.audio_base64;
  return {
    value: { language, audioBase64 },
    errors,
  };
}
