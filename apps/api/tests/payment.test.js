import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createHash, createHmac, randomBytes } from "node:crypto";
import mongoose from "mongoose";

process.env.CORS_ALLOWED_ORIGINS = "http://allowed.test";
process.env.INTERNAL_API_KEY = "";
process.env.MONGODB_URI = "";
process.env.OTP_HASH_SECRET = "o".repeat(32);
process.env.OTP_PROVIDER = "";
process.env.OTP_TEST_MODE = "false";
process.env.SESSION_SECRET = "s".repeat(32);
process.env.RAZORPAY_KEY_ID = "rzp_test_mockKeyId";
process.env.RAZORPAY_KEY_SECRET = "mockRazorpaySecretKey123";
process.env.RAZORPAY_WEBHOOK_SECRET = "mockWebhookSecret456";

const { createApp } = await import("../src/app.js");
const { createSessionToken } = await import("../src/modules/auth/session.js");
const { Artisan } = await import("../src/modules/artisans/artisan.model.js");
const { Product } = await import("../src/modules/products/product.model.js");
const { Inquiry } = await import("../src/modules/inquiries/inquiry.model.js");
const { Quotation } = await import("../src/modules/quotations/quotation.model.js");
const { Order } = await import("../src/modules/orders/order.model.js");
const { setRazorpayClient } = await import(
  "../src/modules/payments/razorpay.client.js"
);

let baseUrl;
let server;

const ARTISAN_1_ID = "65f000000000000000000001";
const ARTISAN_2_ID = "65f000000000000000000002";
const BUYER_TOKEN = "buyer_secret_access_token_123";
const BUYER_TOKEN_HASH = createHash("sha256").update(BUYER_TOKEN).digest("hex");

before(async () => {
  Object.defineProperty(mongoose.connection, "readyState", {
    value: 1,
    configurable: true,
  });

  Artisan.findById = (id) => ({
    select: () =>
      Promise.resolve({
        _id: String(id),
        id: String(id),
        authSessionVersion: 0,
      }),
  });

  // Mock Razorpay SDK client
  setRazorpayClient({
    orders: {
      create: async (params) => {
        return {
          id: `order_${randomBytes(6).toString("hex")}`,
          amount: params.amount,
          currency: params.currency,
          receipt: params.receipt,
          status: "created",
        };
      },
    },
  });

  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("1 & 6: POST /api/payments/initiate initiates payment for accepted quotation and creates Razorpay order", async () => {
  const mockQuotation = {
    _id: "65f000000000000000000020",
    quotationId: "qtn_accept_1",
    inquiry: "65f000000000000000000030",
    inquiryId: "inq_1",
    product: "65f000000000000000000040",
    productId: "prod_1",
    artisan: ARTISAN_1_ID,
    artisanId: ARTISAN_1_ID,
    buyerName: "Anita Sharma",
    quantity: 10,
    unitPrice: 500,
    subtotal: 5000,
    discount: 500,
    finalAmount: 4500,
    status: "accepted",
    accessTokenHash: BUYER_TOKEN_HASH,
    timeline: "10 Days",
    customization: "Blue finish",
    notes: "Custom batch",
    select: function () {
      return Promise.resolve(this);
    },
  };

  const origQuotationFindOne = Quotation.findOne;
  const origOrderFindOne = Order.findOne;
  const origProductFindById = Product.findById;
  const origInquiryFindById = Inquiry.findById;
  let savedOrder = null;

  Quotation.findOne = () => ({
    select: () => Promise.resolve(mockQuotation),
  });
  Order.findOne = () => Promise.resolve(null);
  Product.findById = () =>
    Promise.resolve({
      _id: "65f000000000000000000040",
      title: "Handmade Pot",
    });
  Inquiry.findById = () =>
    Promise.resolve({
      _id: "65f000000000000000000030",
      buyerContact: { phone: "9876543210", email: "anita@example.com" },
    });

  const origOrderSave = Order.prototype.save;
  Order.prototype.save = function () {
    savedOrder = this;
    return Promise.resolve(this);
  };

  try {
    const response = await fetch(`${baseUrl}/api/payments/initiate?token=${BUYER_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quotationId: "qtn_accept_1",
        deliveryAddress: {
          name: "Anita Sharma",
          street: "123 Craft Road",
          city: "Jaipur",
          state: "Rajasthan",
          pincode: "302001",
        },
      }),
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.data.keyId, "rzp_test_mockKeyId");
    assert.ok(body.data.razorpayOrderId.startsWith("order_"));
    // 5: Correct INR-to-paise conversion (4500 rupees = 450000 paise)
    assert.equal(body.data.amount, 450000);
    assert.equal(body.data.currency, "INR");
    assert.equal(body.data.buyerName, "Anita Sharma");
    assert.ok(savedOrder);
    assert.equal(savedOrder.paymentStatus, "pending");
    assert.equal(savedOrder.orderStatus, "awaiting_payment");
    assert.equal(savedOrder.totalAmount, 4500);
  } finally {
    Quotation.findOne = origQuotationFindOne;
    Order.findOne = origOrderFindOne;
    Product.findById = origProductFindById;
    Inquiry.findById = origInquiryFindById;
    Order.prototype.save = origOrderSave;
  }
});

test("2: POST /api/payments/initiate rejects unaccepted (draft/issued/declined) or expired quotations", async () => {
  const origQuotationFindOne = Quotation.findOne;

  // Case A: status = "issued"
  Quotation.findOne = () => ({
    select: () =>
      Promise.resolve({
        quotationId: "qtn_issued",
        status: "issued",
        finalAmount: 1000,
        accessTokenHash: BUYER_TOKEN_HASH,
      }),
  });

  const respIssued = await fetch(`${baseUrl}/api/payments/initiate?token=${BUYER_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quotationId: "qtn_issued" }),
  });
  assert.equal(respIssued.status, 400);
  const bodyIssued = await respIssued.json();
  assert.equal(bodyIssued.error.code, "QUOTATION_NOT_ACCEPTED");

  // Case B: expired quotation
  Quotation.findOne = () => ({
    select: () =>
      Promise.resolve({
        quotationId: "qtn_expired",
        status: "accepted",
        validUntil: new Date(Date.now() - 10000), // in the past
        finalAmount: 1000,
        accessTokenHash: BUYER_TOKEN_HASH,
      }),
  });

  const respExpired = await fetch(`${baseUrl}/api/payments/initiate?token=${BUYER_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quotationId: "qtn_expired" }),
  });
  assert.equal(respExpired.status, 400);
  const bodyExpired = await respExpired.json();
  assert.equal(bodyExpired.error.code, "QUOTATION_EXPIRED");

  Quotation.findOne = origQuotationFindOne;
});

test("3: POST /api/payments/initiate rejects invalid buyer token", async () => {
  const origQuotationFindOne = Quotation.findOne;
  Quotation.findOne = () => ({
    select: () =>
      Promise.resolve({
        quotationId: "qtn_valid",
        status: "accepted",
        finalAmount: 1000,
        accessTokenHash: BUYER_TOKEN_HASH,
      }),
  });

  const response = await fetch(`${baseUrl}/api/payments/initiate?token=wrong_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quotationId: "qtn_valid" }),
  });
  assert.equal(response.status, 403);
  const body = await response.json();
  assert.equal(body.error.code, "FORBIDDEN");

  Quotation.findOne = origQuotationFindOne;
});

test("4: Server strictly controls payable amount from MongoDB regardless of body inputs", async () => {
  const origQuotationFindOne = Quotation.findOne;
  const origOrderFindOne = Order.findOne;
  const origProductFindById = Product.findById;
  const origInquiryFindById = Inquiry.findById;
  const origOrderSave = Order.prototype.save;

  Quotation.findOne = () => ({
    select: () =>
      Promise.resolve({
        _id: "65f000000000000000000021",
        quotationId: "qtn_amount_check",
        inquiry: "65f000000000000000000031",
        product: "65f000000000000000000041",
        artisan: ARTISAN_1_ID,
        buyerName: "Buyer",
        quantity: 5,
        unitPrice: 200,
        subtotal: 1000,
        discount: 0,
        finalAmount: 1000, // MongoDB says 1000
        status: "accepted",
        accessTokenHash: BUYER_TOKEN_HASH,
      }),
  });
  Order.findOne = () => Promise.resolve(null);
  Product.findById = () => Promise.resolve({ title: "Item" });
  Inquiry.findById = () => Promise.resolve({ buyerContact: {} });
  Order.prototype.save = function () {
    return Promise.resolve(this);
  };

  try {
    // Client maliciously attempts to send a tampering amount of 10 rupees or shipping fee
    const response = await fetch(`${baseUrl}/api/payments/initiate?token=${BUYER_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quotationId: "qtn_amount_check",
        amount: 10,
        shippingFee: 500,
        finalPayable: 10,
      }),
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    // Must strictly equal 1000 * 100 = 100000 paise
    assert.equal(body.data.amount, 100000);
    assert.equal(body.data.finalAmount, 1000);
  } finally {
    Quotation.findOne = origQuotationFindOne;
    Order.findOne = origOrderFindOne;
    Product.findById = origProductFindById;
    Inquiry.findById = origInquiryFindById;
    Order.prototype.save = origOrderSave;
  }
});

test("7 & 19: POST /api/payments/verify verifies valid signature and synchronizes quotation and inquiry", async () => {
  const orderNumber = "ORD-111111-AAA111";
  const rzpOrderId = "order_test_12345";
  const rzpPaymentId = "pay_test_98765";

  // Real HMAC SHA-256 signature using the test secret
  const validSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${rzpOrderId}|${rzpPaymentId}`)
    .digest("hex");

  let orderSaved = false;
  let quotationUpdated = false;
  let inquiryUpdated = false;

  const mockOrder = {
    orderNumber,
    quotation: "65f000000000000000000022",
    quotationId: "qtn_sync_test",
    inquiry: "65f000000000000000000032",
    razorpayOrderId: rzpOrderId,
    accessTokenHash: BUYER_TOKEN_HASH,
    paymentStatus: "pending",
    orderStatus: "awaiting_payment",
    totalAmount: 3000,
    buyerName: "Buyer Sync",
    save: async function () {
      orderSaved = true;
      return this;
    },
    toJSON: function () {
      return {
        orderNumber: this.orderNumber,
        paymentStatus: this.paymentStatus,
        orderStatus: this.orderStatus,
        totalAmount: this.totalAmount,
      };
    },
  };

  const origOrderFindOne = Order.findOne;
  const origQuotationFindByIdAndUpdate = Quotation.findByIdAndUpdate;
  const origInquiryFindByIdAndUpdate = Inquiry.findByIdAndUpdate;

  Order.findOne = () => ({
    select: () => Promise.resolve(mockOrder),
  });
  Quotation.findByIdAndUpdate = () => {
    quotationUpdated = true;
    return Promise.resolve({});
  };
  Inquiry.findByIdAndUpdate = () => {
    inquiryUpdated = true;
    return Promise.resolve({});
  };

  try {
    const response = await fetch(`${baseUrl}/api/payments/verify?token=${BUYER_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quotationId: "qtn_sync_test",
        orderNumber,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: rzpPaymentId,
        razorpaySignature: validSignature,
      }),
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.data.order.paymentStatus, "paid");
    assert.equal(body.data.order.orderStatus, "confirmed");
    assert.equal(orderSaved, true);
    assert.equal(quotationUpdated, true);
    assert.equal(inquiryUpdated, true);
  } finally {
    Order.findOne = origOrderFindOne;
    Quotation.findByIdAndUpdate = origQuotationFindByIdAndUpdate;
    Inquiry.findByIdAndUpdate = origInquiryFindByIdAndUpdate;
  }
});

test("8 & 9: POST /api/payments/verify rejects invalid signature or mismatched references", async () => {
  const orderNumber = "ORD-222222-BBB222";
  const rzpOrderId = "order_test_222";
  const rzpPaymentId = "pay_test_222";

  // Invalid signature
  const responseBadSig = await fetch(`${baseUrl}/api/payments/verify?token=${BUYER_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quotationId: "qtn_ref_test",
      orderNumber,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: "invalid_fake_signature_hash_12345",
    }),
  });
  assert.equal(responseBadSig.status, 400);
  const bodyBadSig = await responseBadSig.json();
  assert.equal(bodyBadSig.error.code, "PAYMENT_SIGNATURE_MISMATCH");

  // Valid signature but mismatched Razorpay order ID in database
  const validSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${rzpOrderId}|${rzpPaymentId}`)
    .digest("hex");

  const origOrderFindOne = Order.findOne;
  Order.findOne = () => ({
    select: () =>
      Promise.resolve({
        orderNumber,
        quotationId: "qtn_ref_test",
        razorpayOrderId: "different_order_id_in_db", // mismatch!
        accessTokenHash: BUYER_TOKEN_HASH,
      }),
  });

  const responseMismatch = await fetch(`${baseUrl}/api/payments/verify?token=${BUYER_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quotationId: "qtn_ref_test",
      orderNumber,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: validSignature,
    }),
  });
  assert.equal(responseMismatch.status, 400);
  const bodyMismatch = await responseMismatch.json();
  assert.equal(bodyMismatch.error.code, "PAYMENT_REFERENCE_MISMATCH");

  Order.findOne = origOrderFindOne;
});

test("11: POST /api/payments/verify handles duplicate payment callbacks idempotently", async () => {
  const orderNumber = "ORD-333333-CCC333";
  const rzpOrderId = "order_test_333";
  const rzpPaymentId = "pay_test_333";

  const validSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${rzpOrderId}|${rzpPaymentId}`)
    .digest("hex");

  const origOrderFindOne = Order.findOne;
  Order.findOne = () => ({
    select: () =>
      Promise.resolve({
        orderNumber,
        quotationId: "qtn_dup",
        razorpayOrderId: rzpOrderId,
        accessTokenHash: BUYER_TOKEN_HASH,
        paymentStatus: "paid", // Already paid!
        orderStatus: "confirmed",
        toJSON: () => ({ orderNumber, paymentStatus: "paid", orderStatus: "confirmed" }),
      }),
  });

  const response = await fetch(`${baseUrl}/api/payments/verify?token=${BUYER_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quotationId: "qtn_dup",
      orderNumber,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: validSignature,
    }),
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.data.alreadyProcessed, true);
  assert.equal(body.data.order.paymentStatus, "paid");

  Order.findOne = origOrderFindOne;
});

test("12 & 13: POST /api/payments/webhook verifies raw-body signature and handles payment.captured idempotently", async () => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const rzpOrderId = "order_webhook_123";
  const rzpPaymentId = "pay_webhook_456";

  const eventPayload = {
    entity: "event",
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: rzpPaymentId,
          order_id: rzpOrderId,
          amount: 500000,
          currency: "INR",
          status: "captured",
        },
      },
    },
  };

  const rawBody = JSON.stringify(eventPayload);
  const validWebhookSig = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const origOrderFindOne = Order.findOne;
  const origQuotationFindByIdAndUpdate = Quotation.findByIdAndUpdate;
  const origInquiryFindByIdAndUpdate = Inquiry.findByIdAndUpdate;

  let orderConfirmed = false;
  const mockOrder = {
    orderNumber: "ORD-WEBHOOK-1",
    quotation: "65f000000000000000000023",
    inquiry: "65f000000000000000000033",
    razorpayOrderId: rzpOrderId,
    paymentStatus: "pending",
    orderStatus: "awaiting_payment",
    totalAmount: 5000,
    buyerName: "Webhook Buyer",
    save: async function () {
      orderConfirmed = true;
      return this;
    },
  };

  Order.findOne = () => Promise.resolve(mockOrder);
  Quotation.findByIdAndUpdate = () => Promise.resolve({});
  Inquiry.findByIdAndUpdate = () => Promise.resolve({});

  try {
    // 13: Raw-body signature check
    const response = await fetch(`${baseUrl}/api/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validWebhookSig,
      },
      body: rawBody,
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.confirmed, true);
    assert.equal(orderConfirmed, true);
    assert.equal(mockOrder.paymentStatus, "paid");
    assert.equal(mockOrder.orderStatus, "confirmed");

    // 12: Duplicate delivery
    const dupResponse = await fetch(`${baseUrl}/api/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validWebhookSig,
      },
      body: rawBody,
    });
    assert.equal(dupResponse.status, 200);
    const dupBody = await dupResponse.json();
    assert.equal(dupBody.data.alreadyPaid, true);
  } finally {
    Order.findOne = origOrderFindOne;
    Quotation.findByIdAndUpdate = origQuotationFindByIdAndUpdate;
    Inquiry.findByIdAndUpdate = origInquiryFindByIdAndUpdate;
  }
});

test("10: Webhook payment.failed marks pending order failed but does NOT overwrite confirmed paid status", async () => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const rzpOrderId = "order_fail_check";

  const eventPayload = {
    entity: "event",
    event: "payment.failed",
    payload: {
      payment: {
        entity: {
          id: "pay_failed_1",
          order_id: rzpOrderId,
        },
      },
    },
  };

  const rawBody = JSON.stringify(eventPayload);
  const validWebhookSig = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const origOrderFindOne = Order.findOne;

  // Case A: pending order becomes failed
  const pendingOrder = {
    razorpayOrderId: rzpOrderId,
    paymentStatus: "pending",
    save: async function () {
      return this;
    },
  };
  Order.findOne = () => Promise.resolve(pendingOrder);

  const res1 = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": validWebhookSig,
    },
    body: rawBody,
  });
  assert.equal(res1.status, 200);
  assert.equal(pendingOrder.paymentStatus, "failed");

  // Case B: already paid order is NOT changed to failed
  const paidOrder = {
    razorpayOrderId: rzpOrderId,
    paymentStatus: "paid",
    save: async function () {
      throw new Error("Should not be saved");
    },
  };
  Order.findOne = () => Promise.resolve(paidOrder);

  const res2 = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": validWebhookSig,
    },
    body: rawBody,
  });
  assert.equal(res2.status, 200);
  assert.equal(paidOrder.paymentStatus, "paid");

  Order.findOne = origOrderFindOne;
});

test("14 & 15: Payment retry reuses or updates pending order without creating duplicate records", async () => {
  const origQuotationFindOne = Quotation.findOne;
  const origOrderFindOne = Order.findOne;
  const origProductFindById = Product.findById;
  const origInquiryFindById = Inquiry.findById;

  const mockQuotation = {
    _id: "65f000000000000000000025",
    quotationId: "qtn_retry",
    inquiry: "65f000000000000000000035",
    product: "65f000000000000000000045",
    artisan: ARTISAN_1_ID,
    buyerName: "Retry Buyer",
    quantity: 2,
    unitPrice: 1000,
    subtotal: 2000,
    discount: 0,
    finalAmount: 2000,
    status: "accepted",
    accessTokenHash: BUYER_TOKEN_HASH,
  };

  const existingPendingOrder = {
    orderNumber: "ORD-RETRY-001",
    quotation: mockQuotation._id,
    paymentStatus: "pending",
    orderStatus: "awaiting_payment",
    razorpayOrderId: "order_prev",
    save: async function () {
      return this;
    },
  };

  Quotation.findOne = () => ({
    select: () => Promise.resolve(mockQuotation),
  });
  // Simulate finding the existing pending order
  let findCallCount = 0;
  Order.findOne = () => {
    findCallCount += 1;
    if (findCallCount === 1) {
      // First check for paid order: none
      return Promise.resolve(null);
    }
    // Second check for pending order: returns existing pending order
    return Promise.resolve(existingPendingOrder);
  };
  Product.findById = () => Promise.resolve({ title: "Product" });
  Inquiry.findById = () => Promise.resolve({ buyerContact: {} });

  try {
    const response = await fetch(`${baseUrl}/api/payments/initiate?token=${BUYER_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotationId: "qtn_retry" }),
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    // Reused the existing order number
    assert.equal(body.data.orderNumber, "ORD-RETRY-001");
  } finally {
    Quotation.findOne = origQuotationFindOne;
    Order.findOne = origOrderFindOne;
    Product.findById = origProductFindById;
    Inquiry.findById = origInquiryFindById;
  }
});

test("17 & 18: GET /api/orders/:orderNumber enforces guest access token and artisan ownership checks", async () => {
  const origOrderFindOne = Order.findOne;

  const mockOrder = {
    orderNumber: "ORD-SECURITY-1",
    artisan: { _id: ARTISAN_1_ID, name: "Artisan 1" },
    product: { title: "Handicraft Item" },
    totalAmount: 1500,
    paymentStatus: "paid",
    orderStatus: "confirmed",
    accessTokenHash: BUYER_TOKEN_HASH,
    toJSON: function () {
      return {
        orderNumber: this.orderNumber,
        totalAmount: this.totalAmount,
        paymentStatus: this.paymentStatus,
      };
    },
  };

  Order.findOne = () => ({
    populate: () => ({
      populate: () => ({
        populate: () => Promise.resolve(mockOrder),
      }),
    }),
    select: () => Promise.resolve(mockOrder),
  });

  try {
    // 18: Guest access with valid token succeeds
    const resGuestValid = await fetch(`${baseUrl}/api/orders/ORD-SECURITY-1?token=${BUYER_TOKEN}`);
    assert.equal(resGuestValid.status, 200);
    const guestBody = await resGuestValid.json();
    assert.equal(guestBody.data.orderNumber, "ORD-SECURITY-1");

    // 18: Guest access with wrong token is forbidden
    const resGuestBad = await fetch(`${baseUrl}/api/orders/ORD-SECURITY-1?token=bad_token`);
    assert.equal(resGuestBad.status, 403);

    // 17: Authenticated owner artisan succeeds
    const ownerToken = createSessionToken({ artisanId: ARTISAN_1_ID, sessionVersion: 0 });
    const resOwner = await fetch(`${baseUrl}/api/orders/ORD-SECURITY-1`, {
      headers: { Cookie: `craftigari_session=${ownerToken}` },
    });
    assert.equal(resOwner.status, 200);

    // 17: Authenticated non-owner artisan fails with 403
    const strangerToken = createSessionToken({ artisanId: ARTISAN_2_ID, sessionVersion: 0 });
    const resStranger = await fetch(`${baseUrl}/api/orders/ORD-SECURITY-1`, {
      headers: { Cookie: `craftigari_session=${strangerToken}` },
    });
    assert.equal(resStranger.status, 403);
  } finally {
    Order.findOne = origOrderFindOne;
  }
});

test("GET /api/orders lists orders belonging only to authenticated artisan with status filtering", async () => {
  const origOrderFind = Order.find;
  let receivedQuery = null;

  Order.find = (q) => {
    receivedQuery = q;
    return {
      sort: () => ({
        populate: () =>
          Promise.resolve([
            {
              orderNumber: "ORD-LIST-1",
              totalAmount: 2500,
              paymentStatus: "paid",
              orderStatus: "confirmed",
              toJSON: () => ({ orderNumber: "ORD-LIST-1", totalAmount: 2500 }),
            },
          ]),
      }),
    };
  };

  try {
    const token = createSessionToken({ artisanId: ARTISAN_1_ID, sessionVersion: 0 });
    const response = await fetch(`${baseUrl}/api/orders?status=active`, {
      headers: { Cookie: `craftigari_session=${token}` },
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.data.orders.length, 1);
    assert.equal(receivedQuery.artisan, ARTISAN_1_ID);
    assert.equal(receivedQuery.paymentStatus, "paid");
    assert.deepEqual(receivedQuery.orderStatus, { $in: ["confirmed", "processing"] });
  } finally {
    Order.find = origOrderFind;
  }
});

test("PATCH /api/orders/:orderNumber/status updates fulfillment status without altering paymentStatus", async () => {
  const origOrderFindOne = Order.findOne;

  const mockOrder = {
    orderNumber: "ORD-STATUS-1",
    artisan: ARTISAN_1_ID,
    paymentStatus: "paid",
    orderStatus: "confirmed",
    save: async function () {
      return this;
    },
    toJSON: function () {
      return {
        orderNumber: this.orderNumber,
        paymentStatus: this.paymentStatus,
        orderStatus: this.orderStatus,
      };
    },
  };

  Order.findOne = () => Promise.resolve(mockOrder);

  try {
    const token = createSessionToken({ artisanId: ARTISAN_1_ID, sessionVersion: 0 });
    const response = await fetch(`${baseUrl}/api/orders/ORD-STATUS-1/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `craftigari_session=${token}`,
      },
      body: JSON.stringify({ orderStatus: "processing" }),
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.orderStatus, "processing");
    // Payment status remains strictly paid
    assert.equal(body.data.paymentStatus, "paid");
  } finally {
    Order.findOne = origOrderFindOne;
  }
});
