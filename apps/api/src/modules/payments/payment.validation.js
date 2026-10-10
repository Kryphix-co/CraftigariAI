export function validateInitiatePayment(body = {}) {
  const errors = [];
  const value = {};

  if (
    !body.quotationId ||
    typeof body.quotationId !== "string" ||
    !body.quotationId.trim()
  ) {
    errors.push({ field: "quotationId", message: "Quotation ID is required" });
  } else {
    value.quotationId = body.quotationId.trim();
  }

  if (body.deliveryAddress && typeof body.deliveryAddress === "object") {
    const addr = body.deliveryAddress;
    value.deliveryAddress = {
      name: typeof addr.name === "string" ? addr.name.trim().slice(0, 120) : "",
      phone: typeof addr.phone === "string" ? addr.phone.trim().slice(0, 30) : "",
      street: typeof addr.street === "string" ? addr.street.trim().slice(0, 300) : "",
      city: typeof addr.city === "string" ? addr.city.trim().slice(0, 100) : "",
      state: typeof addr.state === "string" ? addr.state.trim().slice(0, 100) : "",
      pincode: typeof addr.pincode === "string" ? addr.pincode.trim().slice(0, 20) : "",
    };
  } else {
    value.deliveryAddress = {
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    };
  }

  return { errors, value };
}

export function validateVerifyPayment(body = {}) {
  const errors = [];
  const value = {};

  const requiredFields = [
    "quotationId",
    "orderNumber",
    "razorpayOrderId",
    "razorpayPaymentId",
    "razorpaySignature",
  ];

  for (const field of requiredFields) {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      errors.push({ field, message: `${field} is required` });
    } else {
      value[field] = body[field].trim();
    }
  }

  return { errors, value };
}
