import { normalizeIndianPhone } from "./auth.crypto.js";

function unknownFields(input, allowed) {
  return Object.keys(input)
    .filter((field) => !allowed.has(field))
    .map((field) => ({ field, message: "Unknown authentication field" }));
}

export function validateSendOtp(input) {
  const errors = unknownFields(input, new Set(["phone"]));
  const phone = normalizeIndianPhone(input.phone);
  if (!phone) {
    errors.push({
      field: "phone",
      message: "Must be a valid Indian mobile number",
    });
  }
  return { value: { phone }, errors };
}

export function validateVerifyOtp(input) {
  const errors = unknownFields(input, new Set(["phone", "otp"]));
  const phone = normalizeIndianPhone(input.phone);
  if (!phone) {
    errors.push({
      field: "phone",
      message: "Must be a valid Indian mobile number",
    });
  }
  const otp = typeof input.otp === "string" ? input.otp.trim() : "";
  if (!/^\d{6}$/.test(otp)) {
    errors.push({ field: "otp", message: "Must be a 6-digit OTP" });
  }
  return { value: { phone, otp }, errors };
}
