import { createHash, randomBytes } from "node:crypto";
import { connectToDatabase } from "../../config/database.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import { Quotation } from "../quotations/quotation.model.js";
import { Inquiry } from "../inquiries/inquiry.model.js";
import { Product } from "../products/product.model.js";
import { Order } from "../orders/order.model.js";
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from "./razorpay.client.js";

function hashToken(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = randomBytes(3).toString("hex").toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function initiatePaymentService({ quotationId, token, deliveryAddress }) {
  if (!token) {
    throw new ApiError(401, "Quotation access token is required", {
      code: "UNAUTHORIZED",
    });
  }

  await connectToDatabase();

  const quotation = await Quotation.findOne({ quotationId }).select("+accessTokenHash");
  if (!quotation) {
    throw new ApiError(404, "Quotation not found", { code: "NOT_FOUND" });
  }

  const candidateHash = hashToken(token);
  let isAuthorized = quotation.accessTokenHash === candidateHash;

  if (!isAuthorized && quotation.inquiry) {
    const linkedInquiry = await Inquiry.findById(quotation.inquiry).select("+accessTokenHash");
    if (linkedInquiry?.accessTokenHash === candidateHash) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    throw new ApiError(403, "Invalid quotation access token", {
      code: "FORBIDDEN",
    });
  }

  if (quotation.status !== "accepted") {
    throw new ApiError(400, "Only accepted quotations can proceed to payment", {
      code: "QUOTATION_NOT_ACCEPTED",
    });
  }

  if (quotation.validUntil && new Date(quotation.validUntil) < new Date()) {
    throw new ApiError(400, "This quotation has expired", {
      code: "QUOTATION_EXPIRED",
    });
  }

  // Prevent duplicate payment for an already paid order
  const existingPaidOrder = await Order.findOne({
    quotation: quotation._id,
    paymentStatus: "paid",
  });
  if (existingPaidOrder) {
    throw new ApiError(409, "Payment has already been completed for this quotation", {
      code: "ORDER_ALREADY_PAID",
      orderNumber: existingPaidOrder.orderNumber,
    });
  }

  // Strictly server-controlled final payable amount (no frontend tampering, no invented fees)
  const finalAmount = Math.max(0, Math.round(Number(quotation.finalAmount) || 0));
  if (finalAmount <= 0) {
    throw new ApiError(400, "Invalid quotation payable amount", {
      code: "INVALID_AMOUNT",
    });
  }

  const amountInPaise = Math.round(finalAmount * 100);

  const [product, inquiry] = await Promise.all([
    Product.findById(quotation.product),
    Inquiry.findById(quotation.inquiry),
  ]);

  if (!product) {
    throw new ApiError(404, "Associated product not found", { code: "NOT_FOUND" });
  }

  // Find existing awaiting_payment order to avoid orphaned duplicates, or create a new draft order
  let order = await Order.findOne({
    quotation: quotation._id,
    paymentStatus: "pending",
    orderStatus: "awaiting_payment",
  });

  const termsSnapshot = {
    quantity: quotation.quantity,
    unitPrice: quotation.unitPrice,
    subtotal: quotation.subtotal,
    discount: quotation.discount || 0,
    finalAmount,
    timeline: quotation.timeline || "15 Days",
    customization: quotation.customization || "",
    notes: quotation.notes || "",
    acceptedAt: quotation.updatedAt || new Date(),
  };

  const buyerContact = {
    phone: inquiry?.buyerContact?.phone || "",
    email: inquiry?.buyerContact?.email || "",
    organization: inquiry?.buyerContact?.organization || "",
  };

  const address = deliveryAddress || {};
  const formattedDeliveryAddress = {
    name: address.name || quotation.buyerName,
    phone: address.phone || buyerContact.phone,
    street: address.street || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
  };

  if (!order) {
    order = new Order({
      orderNumber: generateOrderNumber(),
      quotation: quotation._id,
      quotationId: quotation.quotationId,
      inquiry: quotation.inquiry,
      inquiryId: quotation.inquiryId,
      product: quotation.product,
      productId: quotation.productId,
      artisan: quotation.artisan,
      artisanId: quotation.artisanId,
      buyerName: quotation.buyerName,
      buyerContact,
      deliveryAddress: formattedDeliveryAddress,
      quantity: quotation.quantity,
      unitPrice: quotation.unitPrice,
      totalAmount: finalAmount,
      currency: "INR",
      termsSnapshot,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      orderStatus: "awaiting_payment",
      accessTokenHash: candidateHash,
    });
  } else {
    // Update existing pending order terms and delivery details
    order.deliveryAddress = formattedDeliveryAddress;
    order.totalAmount = finalAmount;
    order.termsSnapshot = termsSnapshot;
  }

  // Create real Razorpay order
  const razorpayOrder = await createRazorpayOrder({
    amountInPaise,
    currency: "INR",
    receipt: order.orderNumber,
    notes: {
      quotationId: quotation.quotationId,
      orderNumber: order.orderNumber,
      artisanId: String(quotation.artisanId),
    },
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    keyId: env.razorpayKeyId,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount, // in paise
    currency: "INR",
    orderNumber: order.orderNumber,
    productTitle: product.title,
    buyerName: quotation.buyerName,
    buyerContact,
    finalAmount, // in rupees
  };
}

export async function verifyPaymentService({
  quotationId,
  token,
  orderNumber,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  if (!token) {
    throw new ApiError(401, "Access token is required", { code: "UNAUTHORIZED" });
  }

  const isValidSignature = verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValidSignature) {
    throw new ApiError(400, "Payment signature verification failed", {
      code: "PAYMENT_SIGNATURE_MISMATCH",
    });
  }

  await connectToDatabase();

  const order = await Order.findOne({ orderNumber }).select("+accessTokenHash");
  if (!order) {
    throw new ApiError(404, "Order not found", { code: "NOT_FOUND" });
  }

  const candidateHash = hashToken(token);
  let isAuthorized = order.accessTokenHash === candidateHash;

  if (!isAuthorized) {
    const quotation = await Quotation.findById(order.quotation).select("+accessTokenHash");
    if (quotation?.accessTokenHash === candidateHash) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    throw new ApiError(403, "Invalid access token for this order", {
      code: "FORBIDDEN",
    });
  }

  if (order.razorpayOrderId !== razorpayOrderId) {
    throw new ApiError(400, "Mismatched Razorpay order reference", {
      code: "PAYMENT_REFERENCE_MISMATCH",
    });
  }

  if (order.quotationId !== quotationId) {
    throw new ApiError(400, "Payment quotation does not match order record", {
      code: "QUOTATION_MISMATCH",
    });
  }

  // Idempotency: if already paid, return existing confirmed order safely
  if (order.paymentStatus === "paid") {
    return {
      order: order.toJSON(),
      alreadyProcessed: true,
    };
  }

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.paidAt = new Date();
  await order.save();

  // Link Order to Quotation
  await Quotation.findByIdAndUpdate(order.quotation, {
    order: order._id,
    orderNumber: order.orderNumber,
  });

  // Append confirmation message to Inquiry
  await Inquiry.findByIdAndUpdate(order.inquiry, {
    status: "closed",
    $push: {
      messages: {
        sender: "buyer",
        senderName: order.buyerName,
        message: `भुगतान सफल (Payment Verified): ₹${order.totalAmount.toLocaleString("en-IN")} via Razorpay. Order #${order.orderNumber} confirmed.`,
        createdAt: new Date(),
      },
    },
  });

  return {
    order: order.toJSON(),
    success: true,
  };
}

export async function handleWebhookService({ rawBody, signature }) {
  const isValid = verifyWebhookSignature({ rawBody, signature });
  if (!isValid) {
    throw new ApiError(400, "Invalid webhook signature", {
      code: "WEBHOOK_SIGNATURE_INVALID",
    });
  }

  await connectToDatabase();

  const payloadString = Buffer.isBuffer(rawBody)
    ? rawBody.toString("utf8")
    : String(rawBody);

  let eventPayload;
  try {
    eventPayload = JSON.parse(payloadString);
  } catch {
    throw new ApiError(400, "Malformed webhook JSON payload", {
      code: "INVALID_WEBHOOK_JSON",
    });
  }

  const eventName = eventPayload.event;
  const paymentEntity = eventPayload.payload?.payment?.entity;
  const orderEntity = eventPayload.payload?.order?.entity;

  const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
  const rzpPaymentId = paymentEntity?.id;

  if (eventName === "payment.captured" || eventName === "order.paid") {
    if (!rzpOrderId) {
      return { received: true, ignored: true };
    }

    const order = await Order.findOne({ razorpayOrderId: rzpOrderId });
    if (!order) {
      return { received: true, notFound: true };
    }

    // Idempotent: do not repeat confirmation if already paid
    if (order.paymentStatus === "paid") {
      return { received: true, alreadyPaid: true };
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    if (rzpPaymentId) order.razorpayPaymentId = rzpPaymentId;
    order.paidAt = new Date();
    await order.save();

    await Quotation.findByIdAndUpdate(order.quotation, {
      order: order._id,
      orderNumber: order.orderNumber,
    });

    await Inquiry.findByIdAndUpdate(order.inquiry, {
      status: "closed",
      $push: {
        messages: {
          sender: "buyer",
          senderName: order.buyerName,
          message: `भुगतान सफल (Payment Captured via Webhook): ₹${order.totalAmount.toLocaleString("en-IN")}. Order #${order.orderNumber} confirmed.`,
          createdAt: new Date(),
        },
      },
    });

    return { received: true, confirmed: true };
  }

  if (eventName === "payment.failed") {
    if (rzpOrderId) {
      const order = await Order.findOne({ razorpayOrderId: rzpOrderId });
      // Never overwrite an already paid confirmed order with a late or secondary failed event
      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "failed";
        await order.save();
      }
    }
    return { received: true, markedFailed: true };
  }

  return { received: true, event: eventName };
}
