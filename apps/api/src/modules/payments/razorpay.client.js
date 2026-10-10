import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env.js";

let razorpayClientInstance = null;

export function getRazorpayClient() {
  if (!razorpayClientInstance && env.razorpayKeyId && env.razorpayKeySecret) {
    razorpayClientInstance = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }
  return razorpayClientInstance;
}

export function setRazorpayClient(client) {
  razorpayClientInstance = client;
}

export async function createRazorpayOrder({
  amountInPaise,
  currency = "INR",
  receipt,
  notes = {},
}) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error("Razorpay credentials are not configured");
  }

  return client.orders.create({
    amount: amountInPaise,
    currency,
    receipt,
    notes,
  });
}

function safeEqual(candidate, expected) {
  if (typeof candidate !== "string" || typeof expected !== "string") {
    return false;
  }
  const candidateBuf = Buffer.from(candidate, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (candidateBuf.length !== expectedBuf.length) {
    return false;
  }
  return timingSafeEqual(candidateBuf, expectedBuf);
}

export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const secret = env.razorpayKeySecret;
  if (!secret) {
    throw new Error("Razorpay key secret is not configured");
  }
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return safeEqual(razorpaySignature, expectedSignature);
}

export function verifyWebhookSignature({ rawBody, signature, secret }) {
  const webhookSecret = secret ?? env.razorpayWebhookSecret;
  if (!webhookSecret || !signature || !rawBody) {
    return false;
  }

  const bodyString = Buffer.isBuffer(rawBody)
    ? rawBody.toString("utf8")
    : String(rawBody);

  try {
    if (typeof Razorpay.validateWebhookSignature === "function") {
      return Razorpay.validateWebhookSignature(
        bodyString,
        signature,
        webhookSecret,
      );
    }
  } catch {
    // Fall back to direct HMAC calculation
  }

  const expectedSignature = createHmac("sha256", webhookSecret)
    .update(bodyString)
    .digest("hex");

  return safeEqual(signature, expectedSignature);
}
