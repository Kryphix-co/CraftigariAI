import { ok, created } from "../../utils/response.js";
import {
  initiatePaymentService,
  verifyPaymentService,
  handleWebhookService,
} from "./payment.service.js";

export async function initiatePayment(request, response) {
  const token = request.query.token || request.headers["x-quotation-token"];
  const result = await initiatePaymentService({
    quotationId: request.validated.body.quotationId,
    token,
    deliveryAddress: request.validated.body.deliveryAddress,
  });
  created(response, result);
}

export async function verifyPayment(request, response) {
  const token = request.query.token || request.headers["x-quotation-token"];
  const result = await verifyPaymentService({
    quotationId: request.validated.body.quotationId,
    token,
    orderNumber: request.validated.body.orderNumber,
    razorpayOrderId: request.validated.body.razorpayOrderId,
    razorpayPaymentId: request.validated.body.razorpayPaymentId,
    razorpaySignature: request.validated.body.razorpaySignature,
  });
  ok(response, result);
}

export async function handleWebhook(request, response) {
  const signature = request.headers["x-razorpay-signature"] || "";
  const rawBody = request.rawBody || Buffer.from(JSON.stringify(request.body || {}));
  const result = await handleWebhookService({
    rawBody,
    signature,
  });
  ok(response, result);
}
