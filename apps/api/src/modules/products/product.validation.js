import mongoose from "mongoose";

const PRODUCT_FIELDS = new Set([
  "title",
  "description",
  "category",
  "craftType",
  "material",
  "materials",
  "colours",
  "tags",
  "effort",
  "size",
  "price",
  "pricing",
  "images",
  "makingProcess",
]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function addString(input, output, errors, field, maxLength) {
  if (!(field in input)) return;
  if (typeof input[field] !== "string") {
    errors.push({ field, message: "Must be a string" });
    return;
  }
  const value = input[field].trim();
  if (value.length > maxLength) {
    errors.push({ field, message: `Must be at most ${maxLength} characters` });
    return;
  }
  output[field] = value;
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseStringArray(value, field, errors, { maxItems, maxLength, urls = false }) {
  const source = typeof value === "string" ? [value] : value;
  if (!Array.isArray(source)) {
    errors.push({ field, message: "Must be an array of strings" });
    return undefined;
  }
  if (source.length > maxItems) {
    errors.push({ field, message: `Must contain at most ${maxItems} items` });
  }

  const result = [];
  source.forEach((item, index) => {
    if (typeof item !== "string" || !item.trim()) {
      errors.push({ field: `${field}.${index}`, message: "Must be a non-empty string" });
      return;
    }
    const trimmed = item.trim();
    if (trimmed.length > maxLength) {
      errors.push({ field: `${field}.${index}`, message: `Must be at most ${maxLength} characters` });
      return;
    }
    if (urls && !isHttpUrl(trimmed)) {
      errors.push({ field: `${field}.${index}`, message: "Must be an HTTP or HTTPS URL" });
      return;
    }
    result.push(trimmed);
  });
  return result;
}

function parseMakingProcess(value, errors) {
  if (!Array.isArray(value)) {
    errors.push({ field: "makingProcess", message: "Must be an array" });
    return undefined;
  }
  if (value.length > 5) {
    errors.push({ field: "makingProcess", message: "Must contain at most 5 steps" });
  }

  const seenIds = new Set();
  return value.slice(0, 5).map((step, index) => {
    const field = `makingProcess.${index}`;
    if (!isPlainObject(step)) {
      errors.push({ field, message: "Must be an object" });
      return { id: `invalid-${index}`, order: index };
    }

    const normalized = {
      id: typeof step.id === "string" ? step.id.trim() : "",
      stage: typeof step.stage === "string" ? step.stage.trim() : "custom",
      title: typeof step.title === "string" ? step.title.trim() : "",
      description:
        typeof step.description === "string" ? step.description.trim() : "",
      imageUrl:
        typeof (step.imageUrl ?? step.image) === "string"
          ? (step.imageUrl ?? step.image).trim()
          : "",
      order: step.order === undefined ? index : Number(step.order),
    };

    if (!normalized.id || normalized.id.length > 100) {
      errors.push({ field: `${field}.id`, message: "Must be 1–100 characters" });
    } else if (seenIds.has(normalized.id)) {
      errors.push({ field: `${field}.id`, message: "Must be unique within the product" });
    }
    seenIds.add(normalized.id);

    if (normalized.stage.length > 80) {
      errors.push({ field: `${field}.stage`, message: "Must be at most 80 characters" });
    }
    if (normalized.title.length > 120) {
      errors.push({ field: `${field}.title`, message: "Must be at most 120 characters" });
    }
    if (normalized.description.length > 2000) {
      errors.push({ field: `${field}.description`, message: "Must be at most 2000 characters" });
    }
    if (normalized.imageUrl && !isHttpUrl(normalized.imageUrl)) {
      errors.push({ field: `${field}.imageUrl`, message: "Must be an HTTP or HTTPS URL" });
    }
    if (!Number.isInteger(normalized.order) || normalized.order < 0 || normalized.order > 4) {
      errors.push({ field: `${field}.order`, message: "Must be an integer from 0 to 4" });
    }

    return normalized;
  });
}

function validateProductBody(input, requireChanges) {
  const errors = [];
  const value = {};
  if (!isPlainObject(input)) {
    return { value, errors: [{ field: "body", message: "Must be a JSON object" }] };
  }

  for (const field of Object.keys(input)) {
    if (!PRODUCT_FIELDS.has(field)) {
      errors.push({ field, message: "Unknown product field" });
    }
  }

  addString(input, value, errors, "title", 160);
  addString(input, value, errors, "description", 5000);
  addString(input, value, errors, "category", 120);
  addString(input, value, errors, "craftType", 120);
  addString(input, value, errors, "effort", 500);
  addString(input, value, errors, "size", 120);

  if ("materials" in input || "material" in input) {
    value.materials = parseStringArray(
      input.materials ?? input.material,
      "materials",
      errors,
      { maxItems: 20, maxLength: 120 },
    );
  }

  if ("price" in input) {
    const price = Number(input.price);
    if (!Number.isFinite(price) || price < 0) {
      errors.push({ field: "price", message: "Must be a non-negative number" });
    } else {
      value.price = price;
    }
  }

  if ("images" in input) {
    value.images = parseStringArray(input.images, "images", errors, {
      maxItems: 10,
      maxLength: 2000,
      urls: true,
    });
  }

  if ("colours" in input) {
    value.colours = parseStringArray(input.colours, "colours", errors, {
      maxItems: 20,
      maxLength: 120,
    });
  }

  if ("tags" in input) {
    value.tags = parseStringArray(input.tags, "tags", errors, {
      maxItems: 12,
      maxLength: 80,
    });
  }

  if ("pricing" in input) {
    if (input.pricing === null) {
      value.pricing = null;
    } else {
      value.pricing = parsePricingBreakdown(input.pricing, errors);
    }
  }

  if ("makingProcess" in input) {
    value.makingProcess = parseMakingProcess(input.makingProcess, errors);
  }

  Object.keys(value).forEach((field) => {
    if (value[field] === undefined) delete value[field];
  });

  if (requireChanges && Object.keys(value).length === 0 && errors.length === 0) {
    errors.push({ field: "body", message: "At least one product field is required" });
  }

  return { value, errors };
}

function parsePricingBreakdown(input, errors) {
  if (!isPlainObject(input)) {
    errors.push({ field: "pricing", message: "Must be a JSON object" });
    return undefined;
  }
  const result = {};
  const costFields = ["materialCost", "labourCost", "packagingCost", "otherExpenses"];
  for (const field of costFields) {
    if (field in input && input[field] !== null && input[field] !== "") {
      const val = Number(input[field]);
      if (!Number.isFinite(val) || val < 0) {
        errors.push({ field: `pricing.${field}`, message: "Must be a non-negative number" });
      } else {
        result[field] = Math.round(val);
      }
    }
  }
  if ("profitPercentage" in input && input.profitPercentage !== null && input.profitPercentage !== "") {
    const val = Number(input.profitPercentage);
    if (!Number.isFinite(val) || val < 0 || val > 1000) {
      errors.push({ field: "pricing.profitPercentage", message: "Must be a number between 0 and 1000" });
    } else {
      result.profitPercentage = Math.round(val * 10) / 10;
    }
  }
  if ("totalCost" in input && input.totalCost !== null && input.totalCost !== "") {
    const val = Number(input.totalCost);
    if (!Number.isFinite(val) || val < 0) {
      errors.push({ field: "pricing.totalCost", message: "Must be a non-negative number" });
    } else {
      result.totalCost = Math.round(val);
    }
  }
  if ("suggestedPrice" in input && input.suggestedPrice !== null && input.suggestedPrice !== "") {
    const val = Number(input.suggestedPrice);
    if (!Number.isFinite(val) || val < 0) {
      errors.push({ field: "pricing.suggestedPrice", message: "Must be a non-negative number" });
    } else {
      result.suggestedPrice = Math.round(val);
    }
  }
  return result;
}

export function validateCalculatePricing(input) {
  const errors = [];
  if (!isPlainObject(input)) {
    return { value: {}, errors: [{ field: "body", message: "Must be a JSON object" }] };
  }
  const pricing = parsePricingBreakdown(input, errors) || {};
  let selectedPrice;
  if ("selectedPrice" in input && input.selectedPrice !== null && input.selectedPrice !== "") {
    const val = Number(input.selectedPrice);
    if (!Number.isFinite(val) || val < 0) {
      errors.push({ field: "selectedPrice", message: "Must be a non-negative number" });
    } else {
      selectedPrice = Math.round(val);
    }
  } else if ("finalPrice" in input && input.finalPrice !== null && input.finalPrice !== "") {
    const val = Number(input.finalPrice);
    if (!Number.isFinite(val) || val < 0) {
      errors.push({ field: "finalPrice", message: "Must be a non-negative number" });
    } else {
      selectedPrice = Math.round(val);
    }
  }

  return {
    value: { ...pricing, ...(selectedPrice !== undefined ? { selectedPrice } : {}) },
    errors,
  };
}

export function validateFairDealOffer(input) {
  const errors = [];
  if (!isPlainObject(input)) {
    return { value: {}, errors: [{ field: "body", message: "Must be a JSON object" }] };
  }
  const rawOffer = input.offerPrice ?? input.offer;
  const offerPrice = Number(rawOffer);
  if (rawOffer === undefined || rawOffer === null || !Number.isFinite(offerPrice) || offerPrice <= 0) {
    errors.push({ field: "offerPrice", message: "Must be a positive number" });
  }

  const value = { offerPrice: Math.round(offerPrice) };

  if ("quantity" in input && input.quantity !== null && input.quantity !== "") {
    const qty = Number(input.quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      errors.push({ field: "quantity", message: "Must be a positive integer" });
    } else {
      value.quantity = qty;
    }
  }

  if ("counterOfferPrice" in input && input.counterOfferPrice !== null && input.counterOfferPrice !== "") {
    const counter = Number(input.counterOfferPrice);
    if (!Number.isFinite(counter) || counter <= 0) {
      errors.push({ field: "counterOfferPrice", message: "Must be a positive number" });
    } else {
      value.counterOfferPrice = Math.round(counter);
    }
  }

  if ("totalCost" in input && input.totalCost !== null && input.totalCost !== "") {
    const cost = Number(input.totalCost);
    if (!Number.isFinite(cost) || cost < 0) {
      errors.push({ field: "totalCost", message: "Must be a non-negative number" });
    } else {
      value.totalCost = Math.round(cost);
    }
  }

  return { value, errors };
}

export const validateCreateProduct = (input) => validateProductBody(input, false);
export const validateUpdateProduct = (input) => validateProductBody(input, true);

export function validateProductParams(input) {
  const productId = typeof input.productId === "string" ? input.productId.trim() : "";
  const errors = [];
  if (!productId || productId.length > 100 || !/^[A-Za-z0-9_-]+$/.test(productId)) {
    errors.push({ field: "productId", message: "Must be a valid product ID" });
  }
  return { value: { productId }, errors };
}

export function validateArtisanParams(input) {
  const artisanId = typeof input.artisanId === "string" ? input.artisanId.trim() : "";
  const errors = mongoose.isValidObjectId(artisanId)
    ? []
    : [{ field: "artisanId", message: "Must be a valid artisan ID" }];
  return { value: { artisanId }, errors };
}

export function validatePagination(
  input,
  { allowArtisan = false, allowStatus = false } = {},
) {
  const page = Number(input.page ?? 1);
  const limit = Number(input.limit ?? 20);
  const errors = [];
  if (!Number.isInteger(page) || page < 1) {
    errors.push({ field: "page", message: "Must be a positive integer" });
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    errors.push({ field: "limit", message: "Must be an integer from 1 to 100" });
  }

  const value = { page, limit };
  if (allowArtisan && input.artisanId !== undefined) {
    const artisanId = String(input.artisanId).trim();
    if (!mongoose.isValidObjectId(artisanId)) {
      errors.push({
        field: "artisanId",
        message: "Must be a valid artisan ID",
      });
    } else {
      value.artisanId = artisanId;
    }
  }
  if (allowStatus) {
    const status = input.status ?? "all";
    if (!["all", "draft", "published"].includes(status)) {
      errors.push({ field: "status", message: "Must be all, draft, or published" });
    }
    value.status = status;
  }
  return { value, errors };
}
