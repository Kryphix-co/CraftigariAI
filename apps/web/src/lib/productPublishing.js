import { apiGet, apiPatch, apiPost } from "@/lib/api";
import {
  fileFingerprint,
  PRODUCT_PRICE_OPTIONS,
} from "@/features/product/ProductDraftContext";
import { BACKEND_CATALOG_EVENT } from "@/lib/backendCatalog";
import { uploadImageEntries } from "@/lib/imageUploads";

function materialList(value) {
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateDraft(draft, photos) {
  const description =
    draft.summary.description.trim() || draft.transcript.trim();
  const missing = [];
  if (!draft.summary.title.trim()) missing.push("product title");
  if (!description) missing.push("description");
  if (!draft.summary.craftType.trim()) missing.push("craft type");
  if (!materialList(draft.summary.material).length) missing.push("material");
  const finalPrice =
    typeof draft.pricing?.finalPrice === "number" && draft.pricing.finalPrice > 0
      ? draft.pricing.finalPrice
      : typeof draft.selectedPrice === "number" && draft.selectedPrice > 0
      ? draft.selectedPrice
      : PRODUCT_PRICE_OPTIONS[draft.selectedPrice];
  if (!finalPrice || finalPrice <= 0) missing.push("price");
  if (!photos.length && !draft.photoUploads.length) missing.push("product photo");
  if (missing.length) {
    throw new Error(`Add ${missing.join(", ")} before publishing.`);
  }
}

function baseProductBody(draft) {
  const finalPrice =
    typeof draft.pricing?.finalPrice === "number" && draft.pricing.finalPrice > 0
      ? draft.pricing.finalPrice
      : typeof draft.selectedPrice === "number" && draft.selectedPrice > 0
      ? draft.selectedPrice
      : PRODUCT_PRICE_OPTIONS[draft.selectedPrice] ?? 1150;

  return {
    category:
      draft.summary.category.trim() || draft.summary.craftType.trim(),
    craftType: draft.summary.craftType.trim(),
    description:
      draft.summary.description.trim() || draft.transcript.trim(),
    colours: materialList(draft.summary.colors),
    effort: draft.summary.effort.trim(),
    materials: materialList(draft.summary.material),
    price: finalPrice,
    pricing: draft.pricing
      ? {
          materialCost: draft.pricing.materialCost ?? 0,
          labourCost: draft.pricing.labourCost ?? 0,
          packagingCost: draft.pricing.packagingCost ?? 0,
          otherExpenses: draft.pricing.otherExpenses ?? 0,
          profitPercentage: draft.pricing.profitPercentage ?? 25,
          totalCost: draft.pricing.totalCost ?? 0,
          suggestedPrice: draft.pricing.suggestedPrice ?? finalPrice,
        }
      : null,
    size: draft.size,
    tags: Array.isArray(draft.summary.tags) ? draft.summary.tags : [],
    title: draft.summary.title.trim(),
  };
}

export async function publishProductDraft({
  draft,
  makingProcessImages,
  photos,
  updateDraft,
}) {
  validateDraft(draft, photos);

  if (draft.publishedProductId) {
    return apiGet(`/api/products/published/${draft.publishedProductId}`);
  }

  const productBody = baseProductBody(draft);
  let productId = draft.serverProductId;
  if (!productId) {
    const created = await apiPost("/api/products", productBody);
    productId = created.id;
    updateDraft({ serverProductId: productId });
  }

  const existingPhotoUploads = new Map(
    draft.photoUploads.map((upload) => [upload.fingerprint, upload]),
  );
  const productEntries = photos.map((photo) => ({
    file: photo.file,
    fingerprint: fileFingerprint(photo.file),
    kind: "product",
  }));
  const processEntries = draft.makingProcess.flatMap((step) => {
    const image = makingProcessImages[step.id];
    return image?.file && !step.imageUrl
      ? [{ file: image.file, kind: "process", stepId: step.id }]
      : [];
  });
  const pendingEntries = [
    ...productEntries.filter(
      (entry) => !existingPhotoUploads.has(entry.fingerprint),
    ),
    ...processEntries,
  ];
  const uploaded = await uploadImageEntries(pendingEntries);
  const uploadedByEntry = new Map(
    pendingEntries.map((entry, index) => [entry, uploaded[index]]),
  );

  const photoUploads = photos.length
    ? productEntries.map((entry) => {
        const existing = existingPhotoUploads.get(entry.fingerprint);
        const next = existing ?? uploadedByEntry.get(entry);
        return {
          fingerprint: entry.fingerprint,
          publicId: next.publicId,
          url: next.url,
        };
      })
    : draft.photoUploads;

  const makingProcess = draft.makingProcess.map((step) => {
    const pending = processEntries.find((entry) => entry.stepId === step.id);
    const uploadedImage = pending ? uploadedByEntry.get(pending) : null;
    return uploadedImage
      ? {
          ...step,
          imagePublicId: uploadedImage.publicId,
          imageUrl: uploadedImage.url,
        }
      : step;
  });

  updateDraft({ makingProcess, photoUploads });

  const documentedProcess = makingProcess
    .filter(
      (step) =>
        step.description.trim() ||
        step.imageUrl ||
        (step.stage === "custom" && step.title.trim()),
    )
    .map((step, order) => ({
      description: step.description.trim(),
      id: step.id,
      imageUrl: step.imageUrl || "",
      order,
      stage: step.stage || "custom",
      title: step.title.trim(),
    }));

  await apiPatch(`/api/products/${productId}`, {
    ...productBody,
    images: photoUploads.map((image) => image.url),
    makingProcess: documentedProcess,
  });
  const published = await apiPost(`/api/products/${productId}/publish`);
  updateDraft({
    makingProcess,
    photoUploads,
    publishedProductId: published.id,
    serverProductId: published.id,
  });
  window.dispatchEvent(new Event(BACKEND_CATALOG_EVENT));
  return published;
}
