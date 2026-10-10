export function validateCreateQuotation(body = {}) {
  const errors = [];
  const value = {};

  if (!body.inquiryId || typeof body.inquiryId !== "string" || !body.inquiryId.trim()) {
    errors.push({ field: "inquiryId", message: "Inquiry ID is required" });
  } else {
    value.inquiryId = body.inquiryId.trim();
  }

  const rawQty = Number(body.quantity);
  if (!Number.isInteger(rawQty) || rawQty < 1 || rawQty > 100000) {
    errors.push({ field: "quantity", message: "Quantity must be an integer between 1 and 100,000" });
  } else {
    value.quantity = rawQty;
  }

  const rawPrice = Number(body.unitPrice);
  if (!Number.isFinite(rawPrice) || rawPrice < 0) {
    errors.push({ field: "unitPrice", message: "Unit price must be a non-negative number" });
  } else {
    value.unitPrice = Math.round(rawPrice);
  }

  if (body.discount !== undefined && body.discount !== null && body.discount !== "") {
    const rawDiscount = Number(body.discount);
    if (!Number.isFinite(rawDiscount) || rawDiscount < 0) {
      errors.push({ field: "discount", message: "Discount must be a non-negative number" });
    } else {
      value.discount = Math.round(rawDiscount);
    }
  } else {
    value.discount = 0;
  }

  if (body.notes !== undefined && body.notes !== null) {
    if (typeof body.notes !== "string") {
      errors.push({ field: "notes", message: "Notes must be a string" });
    } else if (body.notes.trim().length > 2000) {
      errors.push({ field: "notes", message: "Notes must be at most 2,000 characters" });
    } else {
      value.notes = body.notes.trim();
    }
  }

  if (body.timeline !== undefined && body.timeline !== null) {
    if (typeof body.timeline !== "string") {
      errors.push({ field: "timeline", message: "Timeline must be a string" });
    } else if (body.timeline.trim().length > 100) {
      errors.push({ field: "timeline", message: "Timeline must be at most 100 characters" });
    } else {
      value.timeline = body.timeline.trim();
    }
  }

  if (body.customization !== undefined && body.customization !== null) {
    if (typeof body.customization !== "string") {
      errors.push({ field: "customization", message: "Customization must be a string" });
    } else if (body.customization.trim().length > 500) {
      errors.push({ field: "customization", message: "Customization must be at most 500 characters" });
    } else {
      value.customization = body.customization.trim();
    }
  }

  if (body.status !== undefined && body.status !== null) {
    const valid = new Set(["draft", "issued"]);
    if (!valid.has(body.status)) {
      errors.push({ field: "status", message: "Status must be 'draft' or 'issued'" });
    } else {
      value.status = body.status;
    }
  } else {
    value.status = "issued";
  }

  return { errors, value };
}

export function validateUpdateQuotationStatus(body = {}) {
  const errors = [];
  const value = {};

  const validStatuses = new Set(["accepted", "declined"]);
  if (!body.status || !validStatuses.has(body.status)) {
    errors.push({ field: "status", message: "Status must be 'accepted' or 'declined'" });
  } else {
    value.status = body.status;
  }

  return { errors, value };
}
