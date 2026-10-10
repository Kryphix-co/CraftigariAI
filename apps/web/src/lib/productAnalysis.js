import { fileFingerprint } from "@/features/product/ProductDraftContext";
import { apiPost } from "@/lib/api";
import { uploadImageEntries } from "@/lib/imageUploads";

function list(value) {
  return typeof value === "string"
    ? value.split(/[,;]/).map((item) => item.trim()).filter(Boolean)
    : [];
}

async function ensureProductPhotos({ draft, photos, updateDraft }) {
  const existing = new Map(
    draft.photoUploads.map((upload) => [upload.fingerprint, upload]),
  );
  const entries = photos.map((photo) => ({
    file: photo.file,
    fingerprint: fileFingerprint(photo.file),
  }));
  const pending = entries.filter((entry) => !existing.has(entry.fingerprint));
  const uploaded = await uploadImageEntries(pending);
  const byFingerprint = new Map(
    pending.map((entry, index) => [entry.fingerprint, uploaded[index]]),
  );
  const photoUploads = photos.length
    ? entries.map((entry) => {
        const image = existing.get(entry.fingerprint) ?? byFingerprint.get(entry.fingerprint);
        return {
          fingerprint: entry.fingerprint,
          publicId: image.publicId,
          url: image.url,
        };
      })
    : draft.photoUploads;
  if (!photoUploads.length) throw new Error("Add at least one product photo before AI analysis.");
  updateDraft({ photoUploads });
  return photoUploads;
}

function knownDetails(draft) {
  return {
    answers: draft.aiAnalysis.answers,
    category: draft.summary.category,
    colours: list(draft.summary.colors),
    craftType: draft.summary.craftType,
    description: draft.summary.description,
    effort: draft.summary.effort,
    materials: list(draft.summary.material),
    size: draft.size,
    title: draft.summary.title,
  };
}

export async function analyzeProductDraft({ draft, photos, updateDraft }) {
  const uploaded = await ensureProductPhotos({ draft, photos, updateDraft });
  const request = {
    description: draft.summary.description,
    imageUrls: uploaded.map((image) => image.url),
    knownDetails: knownDetails(draft),
    language: draft.aiLanguage,
    transcript: draft.transcript,
  };
  const inputKey = JSON.stringify(request);
  if (
    draft.aiAnalysis.inputKey === inputKey &&
    draft.aiAnalysis.suggestions
  ) {
    return draft.aiAnalysis;
  }

  const data = await apiPost("/api/ai/product-analysis", request);
  const suggestions = data.suggestions;
  const aiAnalysis = {
    ...draft.aiAnalysis,
    generatedAt: new Date().toISOString(),
    inputKey,
    questions: data.missingInformationQuestions ?? [],
    skippedQuestionIds: [],
    suggestions,
  };
  updateDraft({
    aiAnalysis,
    photoUploads: uploaded,
    summary: {
      category: draft.summary.category || suggestions.category || "",
      colors: draft.summary.colors || (suggestions.colours ?? []).join(", "),
      craftType: draft.summary.craftType || suggestions.craftType || "",
      description: draft.summary.description || suggestions.description || "",
      material: draft.summary.material || (suggestions.materials ?? []).join(", "),
      tags: draft.summary.tags?.length ? draft.summary.tags : suggestions.tags ?? [],
      title: draft.summary.title || suggestions.title || "",
    },
  });
  return aiAnalysis;
}

export async function analyzeMakingProcessDraft({
  draft,
  makingProcessImages,
  updateDraft,
}) {
  const pending = draft.makingProcess.flatMap((step) => {
    const image = makingProcessImages[step.id];
    return image?.file && !step.imageUrl ? [{ file: image.file, stepId: step.id }] : [];
  });
  const uploaded = await uploadImageEntries(pending);
  const uploadedById = new Map(
    pending.map((entry, index) => [entry.stepId, uploaded[index]]),
  );
  const makingProcess = draft.makingProcess.map((step) => {
    const image = uploadedById.get(step.id);
    return image
      ? { ...step, imagePublicId: image.publicId, imageUrl: image.url }
      : step;
  });
  const eligible = makingProcess.filter(
    (step) => step.description.trim() || step.imageUrl,
  );
  if (!eligible.length) {
    throw new Error("Add a process photo or description before requesting AI help.");
  }
  updateDraft({ makingProcess });
  const data = await apiPost("/api/ai/making-process-analysis", {
    language: draft.aiLanguage,
    steps: eligible.map((step) => ({
      description: step.description,
      id: step.id,
      imageUrl: step.imageUrl || undefined,
      title: step.title,
    })),
  });
  const processAiSuggestions = Object.fromEntries(
    (data.steps ?? []).map((step) => [step.id, step]),
  );
  updateDraft({ makingProcess, processAiSuggestions });
  return processAiSuggestions;
}
