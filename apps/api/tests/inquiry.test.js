import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import mongoose from "mongoose";

process.env.CORS_ALLOWED_ORIGINS = "http://allowed.test";
process.env.INTERNAL_API_KEY = "";
process.env.MONGODB_URI = "";
process.env.OTP_HASH_SECRET = "o".repeat(32);
process.env.OTP_PROVIDER = "";
process.env.OTP_TEST_MODE = "false";
process.env.SESSION_SECRET = "s".repeat(32);

const { createApp } = await import("../src/app.js");
const { createSessionToken } = await import("../src/modules/auth/session.js");
const { Artisan } = await import("../src/modules/artisans/artisan.model.js");
const { Product } = await import("../src/modules/products/product.model.js");
const { Inquiry } = await import("../src/modules/inquiries/inquiry.model.js");
const { Quotation } = await import("../src/modules/quotations/quotation.model.js");
const { buildFallbackDealSaathi } = await import("../src/modules/inquiries/inquiry.service.js");

let baseUrl;
let server;

const ARTISAN_1_ID = "65f000000000000000000001";
const ARTISAN_2_ID = "65f000000000000000000002";

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

test("POST /api/inquiries creates genuine inquiry for a published product", async () => {
  const originalFindOne = Product.findOne;
  const originalCreate = Inquiry.create;

  Product.findOne = (query) => {
    if (query.productId === "prod-terracotta") {
      return Promise.resolve({
        _id: "65f000000000000000000010",
        productId: "prod-terracotta",
        artisan: ARTISAN_1_ID,
        title: "Terracotta Vase",
        status: "published",
        price: 750,
      });
    }
    return Promise.resolve(null);
  };

  let createdPayload;
  Inquiry.create = (doc) => {
    createdPayload = doc;
    return Promise.resolve({
      ...doc,
      toJSON: () => ({
        inquiryId: doc.inquiryId,
        productId: doc.productId,
        buyerName: doc.buyerName,
        quantity: doc.quantity,
        status: doc.status,
      }),
    });
  };

  const response = await fetch(`${baseUrl}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: "prod-terracotta",
      buyerName: "Aditi Rao",
      buyerPhone: "+919876543210",
      buyerEmail: "aditi@studio.test",
      buyerOrganization: "Studio Designs",
      quantity: 50,
      buyerMessage: "Need 50 pieces for wedding decor. Custom red shade required.",
      expectedTimeline: "15 Days",
      proposedPrice: 650,
    }),
  });

  Product.findOne = originalFindOne;
  Inquiry.create = originalCreate;

  assert.equal(response.status, 201);
  const json = await response.json();
  assert.equal(json.success, true);
  assert.ok(json.data.inquiry);
  assert.ok(json.data.accessToken);
  assert.equal(createdPayload.artisan, ARTISAN_1_ID);
  assert.equal(createdPayload.quantity, 50);
  assert.equal(createdPayload.proposedPrice, 650);
  assert.equal(createdPayload.status, "new");
});

test("POST /api/inquiries rejects unpublished or non-existent products", async () => {
  const originalFindOne = Product.findOne;

  Product.findOne = (query) => {
    if (query.productId === "prod-draft") {
      return Promise.resolve({
        productId: "prod-draft",
        status: "draft",
      });
    }
    return Promise.resolve(null);
  };

  const notFoundRes = await fetch(`${baseUrl}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: "non-existent",
      buyerName: "Aditi",
      quantity: 10,
      buyerMessage: "Inquiry text",
    }),
  });
  assert.equal(notFoundRes.status, 404);

  const draftRes = await fetch(`${baseUrl}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: "prod-draft",
      buyerName: "Aditi",
      quantity: 10,
      buyerMessage: "Inquiry text",
    }),
  });
  assert.equal(draftRes.status, 422);

  Product.findOne = originalFindOne;
});

test("GET /api/inquiries lists inquiries belonging only to authenticated artisan", async () => {
  const originalFind = Inquiry.find;
  const originalCount = Inquiry.countDocuments;

  Inquiry.find = (query) => {
    assert.equal(query.artisan, ARTISAN_1_ID);
    return {
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () =>
              Promise.resolve([
                {
                  inquiryId: "inq-101",
                  productId: "prod-terracotta",
                  buyerName: "Aditi",
                  quantity: 50,
                  status: "new",
                  createdAt: new Date(),
                  toJSON: () => ({
                    inquiryId: "inq-101",
                    productId: "prod-terracotta",
                    buyerName: "Aditi",
                    quantity: 50,
                    status: "new",
                  }),
                },
              ]),
          }),
        }),
      }),
    };
  };

  Inquiry.countDocuments = () => Promise.resolve(1);

  const token = createSessionToken({ artisanId: ARTISAN_1_ID, sessionVersion: 0 });
  const response = await fetch(`${baseUrl}/api/inquiries`, {
    headers: { Cookie: `craftigari_session=${token}` },
  });

  Inquiry.find = originalFind;
  Inquiry.countDocuments = originalCount;

  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.data.items.length, 1);
  assert.equal(json.data.items[0].inquiryId, "inq-101");
});

test("GET /api/inquiries/:inquiryId/fair-deal evaluates buyer offer against stored product costs", async () => {
  const originalInquiryFindOne = Inquiry.findOne;
  const originalProductFindOne = Product.findOne;

  Inquiry.findOne = (query) => {
    if (query.inquiryId === "inq-201" && query.artisan === ARTISAN_1_ID) {
      return Promise.resolve({
        inquiryId: "inq-201",
        productId: "prod-vase",
        artisan: ARTISAN_1_ID,
        proposedPrice: 450, // Below declared cost of 600
        quantity: 80,
      });
    }
    return Promise.resolve(null);
  };

  Product.findOne = (query) => {
    if (query.productId === "prod-vase") {
      return Promise.resolve({
        productId: "prod-vase",
        title: "Large Terracotta Vase",
        price: 750,
        pricing: {
          totalCost: 600,
          suggestedPrice: 750,
        },
      });
    }
    return Promise.resolve(null);
  };

  const token = createSessionToken({ artisanId: ARTISAN_1_ID, sessionVersion: 0 });
  const response = await fetch(`${baseUrl}/api/inquiries/inq-201/fair-deal`, {
    headers: { Cookie: `craftigari_session=${token}` },
  });

  Inquiry.findOne = originalInquiryFindOne;
  Product.findOne = originalProductFindOne;

  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.data.hasBuyerOffer, true);
  assert.equal(json.data.isBelowCost, true);
  assert.equal(json.data.belowCostAmount, 150);
  assert.equal(
    json.data.warning,
    "Warning: This offer is ₹150 below your declared production cost.",
  );
});

test("GET /api/inquiries/:inquiryId/fair-deal handles inquiries without buyer proposed price", async () => {
  const originalInquiryFindOne = Inquiry.findOne;
  const originalProductFindOne = Product.findOne;

  Inquiry.findOne = (query) => {
    if (query.inquiryId === "inq-no-offer" && query.artisan === ARTISAN_1_ID) {
      return Promise.resolve({
        inquiryId: "inq-no-offer",
        productId: "prod-vase",
        artisan: ARTISAN_1_ID,
        proposedPrice: null,
        counterOfferPrice: null,
      });
    }
    return Promise.resolve(null);
  };

  Product.findOne = () =>
    Promise.resolve({
      productId: "prod-vase",
      title: "Vase",
      price: 750,
      pricing: { totalCost: 600, suggestedPrice: 750 },
    });

  const token = createSessionToken({ artisanId: ARTISAN_1_ID, sessionVersion: 0 });
  const response = await fetch(`${baseUrl}/api/inquiries/inq-no-offer/fair-deal`, {
    headers: { Cookie: `craftigari_session=${token}` },
  });

  Inquiry.findOne = originalInquiryFindOne;
  Product.findOne = originalProductFindOne;

  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.data.hasBuyerOffer, false);
  assert.equal(json.data.totalCost, 600);
  assert.match(json.data.warning, /did not propose a target price/);
});

test("Deal Saathi fallback generates structured explanation and takeaway rows safely", () => {
  const result = buildFallbackDealSaathi({
    buyerMessage: "Can you supply 80 units in custom red colour within 15 days for our Mumbai event?",
    productTitle: "Terracotta Kalash",
    quantity: 80,
    proposedPrice: 650,
    language: "hi",
  });

  assert.ok(result.summary);
  assert.ok(result.explanation);
  assert.ok(result.suggestedReply);
  assert.ok(result.keyTakeaways.length >= 3);
  const labels = result.keyTakeaways.map((t) => t.label);
  assert.ok(labels.some((l) => l.includes("मात्रा") || l.includes("Quantity")));
});

test("POST /api/quotations creates quotation with safe integer arithmetic and updates inquiry", async () => {
  const originalInquiryFindOne = Inquiry.findOne;
  const originalProductFindOne = Product.findOne;
  const originalQuotationCreate = Quotation.create;

  let updatedInquiry = false;
  Inquiry.findOne = (query) => {
    if (query.inquiryId === "inq-q1" && query.artisan === ARTISAN_1_ID) {
      return Promise.resolve({
        _id: "65f000000000000000000099",
        inquiryId: "inq-q1",
        productId: "prod-pot",
        buyerName: "Anita Desai",
        quantity: 80,
        expectedTimeline: "15 Days",
        messages: [],
        save: () => {
          updatedInquiry = true;
          return Promise.resolve();
        },
      });
    }
    return Promise.resolve(null);
  };

  Product.findOne = () =>
    Promise.resolve({
      _id: "65f000000000000000000088",
      productId: "prod-pot",
      artisan: ARTISAN_1_ID,
      price: 750,
    });

  let quotationDoc;
  Quotation.create = (doc) => {
    quotationDoc = doc;
    return Promise.resolve({
      ...doc,
      toJSON: () => ({
        quotationId: doc.quotationId,
        quantity: doc.quantity,
        unitPrice: doc.unitPrice,
        subtotal: doc.subtotal,
        discount: doc.discount,
        finalAmount: doc.finalAmount,
        status: doc.status,
      }),
    });
  };

  const token = createSessionToken({ artisanId: ARTISAN_1_ID, sessionVersion: 0 });
  const response = await fetch(`${baseUrl}/api/quotations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `craftigari_session=${token}`,
    },
    body: JSON.stringify({
      inquiryId: "inq-q1",
      quantity: 80,
      unitPrice: 750,
      discount: 2000,
      timeline: "15 Days",
      notes: "Custom red finish accounted for.",
    }),
  });

  Inquiry.findOne = originalInquiryFindOne;
  Product.findOne = originalProductFindOne;
  Quotation.create = originalQuotationCreate;

  assert.equal(response.status, 201);
  const json = await response.json();
  assert.equal(json.success, true);
  assert.equal(quotationDoc.subtotal, 80 * 750); // 60,000
  assert.equal(quotationDoc.discount, 2000);
  assert.equal(quotationDoc.finalAmount, 58000); // 60,000 - 2,000
  assert.ok(json.data.publicUrl);
  assert.equal(updatedInquiry, true);
});

test("GET /api/quotations/:quotationId rejects unauthenticated requests without valid access token", async () => {
  const response = await fetch(`${baseUrl}/api/quotations/qtn-12345`);
  assert.equal(response.status, 401);
});

test("GET /api/quotations/:quotationId never reveals private product costs to buyers", () => {
  const qtn = new Quotation({
    quotationId: "qtn-check",
    inquiry: "65f000000000000000000099",
    inquiryId: "inq-check",
    product: "65f000000000000000000088",
    productId: "prod-check",
    artisan: ARTISAN_1_ID,
    artisanId: ARTISAN_1_ID,
    buyerName: "Buyer",
    quantity: 10,
    unitPrice: 750,
    subtotal: 7500,
    discount: 0,
    finalAmount: 7500,
    accessTokenHash: "abc123hash",
  });

  const json = qtn.toJSON();
  assert.equal(json.accessTokenHash, undefined);
  assert.equal(json.pricing, undefined);
  assert.equal(json.materialCost, undefined);
  assert.equal(json.totalCost, undefined);
});
