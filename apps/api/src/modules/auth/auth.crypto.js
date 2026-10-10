import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

export function normalizeIndianPhone(value) {
  if (typeof value !== "string") return null;
  let phone = value.replace(/[\s()-]/g, "");
  if (phone.startsWith("+91")) phone = phone.slice(3);
  else if (phone.startsWith("91") && phone.length === 12) phone = phone.slice(2);
  else if (phone.startsWith("0") && phone.length === 11) phone = phone.slice(1);
  if (!/^[6-9]\d{9}$/.test(phone)) return null;
  return `+91${phone}`;
}

export function generateOtp() {
  return String(randomInt(100000, 1000000));
}

export function createOtpSalt() {
  return randomBytes(16).toString("hex");
}

export function hashOtp({ otp, phone, salt, secret }) {
  return createHmac("sha256", secret)
    .update(`${phone}:${otp}:${salt}`)
    .digest("hex");
}

export function otpMatches({ candidate, expectedHash, phone, salt, secret }) {
  const candidateHash = hashOtp({ otp: candidate, phone, salt, secret });
  const candidateBuffer = Buffer.from(candidateHash, "hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}
