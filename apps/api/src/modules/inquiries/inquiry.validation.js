export function validateCreateInquiry(body = {}) {
  const errors = [];
  const value = {};

  if (!body.productId || typeof body.productId !== "string" || !body.productId.trim()) {
    errors.push({ field: "productId", message: "Product ID is required" });
  } else {
    value.productId = body.productId.trim();
  }

  if (!body.buyerName || typeof body.buyerName !== "string" || !body.buyerName.trim()) {
    errors.push({ field: "buyerName", message: "Buyer name is required" });
  } else if (body.buyerName.trim().length > 120) {
    errors.push({ field: "buyerName", message: "Buyer name must be at most 120 characters" });
  } else {
    value.buyerName = body.buyerName.trim();
  }

  if (body.buyerPhone !== undefined && body.buyerPhone !== null && body.buyerPhone !== "") {
    if (typeof body.buyerPhone !== "string") {
      errors.push({ field: "buyerPhone", message: "Buyer phone must be a string" });
    } else if (body.buyerPhone.trim().length > 30) {
      errors.push({ field: "buyerPhone", message: "Buyer phone must be at most 30 characters" });
    } else {
      value.buyerPhone = body.buyerPhone.trim();
    }
  }

  if (body.buyerEmail !== undefined && body.buyerEmail !== null && body.buyerEmail !== "") {
    if (typeof body.buyerEmail !== "string") {
      errors.push({ field: "buyerEmail", message: "Buyer email must be a string" });
    } else if (body.buyerEmail.trim().length > 120) {
      errors.push({ field: "buyerEmail", message: "Buyer email must be at most 120 characters" });
    } else {
      value.buyerEmail = body.buyerEmail.trim();
    }
  }

  if (body.buyerOrganization !== undefined && body.buyerOrganization !== null && body.buyerOrganization !== "") {
    if (typeof body.buyerOrganization !== "string") {
      errors.push({ field: "buyerOrganization", message: "Organization must be a string" });
    } else if (body.buyerOrganization.trim().length > 120) {
      errors.push({ field: "buyerOrganization", message: "Organization must be at most 120 characters" });
    } else {
      value.buyerOrganization = body.buyerOrganization.trim();
    }
  }

  const rawQty = Number(body.quantity);
  if (!Number.isInteger(rawQty) || rawQty < 1 || rawQty > 100000) {
    errors.push({ field: "quantity", message: "Quantity must be an integer between 1 and 100,000" });
  } else {
    value.quantity = rawQty;
  }

  if (!body.buyerMessage || typeof body.buyerMessage !== "string" || !body.buyerMessage.trim()) {
    errors.push({ field: "buyerMessage", message: "Message is required" });
  } else if (body.buyerMessage.trim().length > 2000) {
    errors.push({ field: "buyerMessage", message: "Message must be at most 2,000 characters" });
  } else {
    value.buyerMessage = body.buyerMessage.trim();
  }

  if (body.expectedTimeline !== undefined && body.expectedTimeline !== null && body.expectedTimeline !== "") {
    if (typeof body.expectedTimeline !== "string") {
      errors.push({ field: "expectedTimeline", message: "Expected timeline must be a string" });
    } else if (body.expectedTimeline.trim().length > 100) {
      errors.push({ field: "expectedTimeline", message: "Expected timeline must be at most 100 characters" });
    } else {
      value.expectedTimeline = body.expectedTimeline.trim();
    }
  }

  if (body.proposedPrice !== undefined && body.proposedPrice !== null && body.proposedPrice !== "") {
    const rawPrice = Number(body.proposedPrice);
    if (!Number.isFinite(rawPrice) || rawPrice < 0) {
      errors.push({ field: "proposedPrice", message: "Proposed price must be a non-negative number" });
    } else {
      value.proposedPrice = Math.round(rawPrice);
    }
  }

  return { errors, value };
}

export function validateInquiryMessage(body = {}) {
  const errors = [];
  const value = {};

  if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
    errors.push({ field: "message", message: "Message is required" });
  } else if (body.message.trim().length > 2000) {
    errors.push({ field: "message", message: "Message must be at most 2,000 characters" });
  } else {
    value.message = body.message.trim();
  }

  if (body.counterOfferPrice !== undefined && body.counterOfferPrice !== null && body.counterOfferPrice !== "") {
    const rawCounter = Number(body.counterOfferPrice);
    if (!Number.isFinite(rawCounter) || rawCounter < 0) {
      errors.push({ field: "counterOfferPrice", message: "Counter-offer price must be a non-negative number" });
    } else {
      value.counterOfferPrice = Math.round(rawCounter);
    }
  }

  if (body.status !== undefined && body.status !== null) {
    const validStatuses = new Set(["new", "in_discussion", "quoted", "closed"]);
    if (!validStatuses.has(body.status)) {
      errors.push({ field: "status", message: "Invalid inquiry status" });
    } else {
      value.status = body.status;
    }
  }

  return { errors, value };
}

export function validateInquiryPagination(query = {}) {
  const errors = [];
  const value = {};

  const page = query.page ? Number(query.page) : 1;
  if (!Number.isInteger(page) || page < 1) {
    errors.push({ field: "page", message: "Page must be a positive integer" });
  } else {
    value.page = page;
  }

  const limit = query.limit ? Number(query.limit) : 20;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    errors.push({ field: "limit", message: "Limit must be between 1 and 100" });
  } else {
    value.limit = limit;
  }

  const validStatuses = new Set(["all", "new", "in_discussion", "quoted", "closed"]);
  const status = query.status ? String(query.status).trim() : "all";
  if (!validStatuses.has(status)) {
    errors.push({ field: "status", message: "Invalid status filter" });
  } else {
    value.status = status;
  }

  return { errors, value };
}
