import assert from "node:assert/strict";
import { after, before, test } from "node:test";

process.env.CORS_ALLOWED_ORIGINS = "http://allowed.test";
process.env.INTERNAL_API_KEY = "";
process.env.MONGODB_URI = "";
process.env.OTP_HASH_SECRET = "o".repeat(32);
process.env.OTP_PROVIDER = "";
process.env.OTP_TEST_MODE = "false";
process.env.SESSION_SECRET = "s".repeat(32);

const { createApp } = await import("../src/app.js");
import mongoose from "mongoose";
const {
  calculateSmartPricing,
  evaluateFairDeal,
  sanitizeMoney,
  sanitizePercentage,
} = await import("../src/modules/products/pricing.calculator.js");
const { createSessionToken } = await import(
  "../src/modules/auth/session.js"
);
const { Artisan } = await import("../src/modules/artisans/artisan.model.js");
const { Product } = await import("../src/modules/products/product.model.js");

let baseUrl;
let server;

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

test("calculateSmartPricing computes total cost, profit markup and suggested price accurately", () => {
  // Example from prompt:
  // Material: 300, Labour: 200, Packaging: 50, Other expenses: 50 => Total cost: 600, Profit markup: 25% => Suggested price: 750
  const result = calculateSmartPricing({
    materialCost: 300,
    labourCost: 200,
    packagingCost: 50,
    otherExpenses: 50,
    profitPercentage: 25,
  });

  assert.equal(result.totalCost, 600);
  assert.equal(result.expectedProfit, 150);
  assert.equal(result.suggestedPrice, 750);
  assert.equal(result.minimumSafePrice, 600);
  assert.equal(result.selectedPrice, 750);
  assert.equal(result.isBelowCost, false);
  assert.equal(result.warning, null);
  assert.equal(result.tiers.minimum, 600);
  assert.equal(result.tiers.recommended, 750);
  assert.equal(result.tiers.premium, 600 + Math.round(150 * 1.5));
});

test("calculateSmartPricing handles negative values and NaN gracefully", () => {
  const result = calculateSmartPricing({
    materialCost: -100,
    labourCost: "invalid",
    packagingCost: null,
    otherExpenses: undefined,
    profitPercentage: -10,
  });

  assert.equal(result.materialCost, 0);
  assert.equal(result.labourCost, 0);
  assert.equal(result.packagingCost, 0);
  assert.equal(result.otherExpenses, 0);
  assert.equal(result.totalCost, 0);
  assert.equal(result.profitPercentage, 0);
  assert.equal(result.suggestedPrice, 0);
  assert.equal(result.isBelowCost, false);
});

test("calculateSmartPricing detects prices below declared cost and generates a warning", () => {
  const result = calculateSmartPricing({
    materialCost: 300,
    labourCost: 200,
    packagingCost: 50,
    otherExpenses: 50,
    profitPercentage: 25,
    selectedPrice: 500, // Below total cost of 600
  });

  assert.equal(result.totalCost, 600);
  assert.equal(result.selectedPrice, 500);
  assert.equal(result.isBelowCost, true);
  assert.equal(result.belowCostDifference, 100);
  assert.match(result.warning, /100 below your declared production cost of ₹600/);
});

test("evaluateFairDeal identifies below-cost buyer offer with exact warning phrasing", () => {
  // Example from prompt:
  // Product cost = 600, Buyer offer = 450
  // Result: "Warning: This offer is ₹150 below your declared production cost."
  const result = evaluateFairDeal({
    totalCost: 600,
    offerPrice: 450,
    productPrice: 750,
  });

  assert.equal(result.isBelowCost, true);
  assert.equal(result.belowCostAmount, 150);
  assert.equal(result.status, "below_cost");
  assert.equal(
    result.warning,
    "Warning: This offer is ₹150 below your declared production cost.",
  );
});

test("evaluateFairDeal identifies profitable buyer offer with exact estimated profit phrasing", () => {
  // Example from prompt:
  // Product cost = 600, Buyer offer = 750
  // Result: "Estimated profit: ₹150 before any unaccounted fees."
  const result = evaluateFairDeal({
    totalCost: 600,
    offerPrice: 750,
    productPrice: 750,
  });

  assert.equal(result.isBelowCost, false);
  assert.equal(result.profitAmount, 150);
  assert.equal(result.status, "profitable");
  assert.equal(
    result.warning,
    "Estimated profit: ₹150 before any unaccounted fees.",
  );
});

test("evaluateFairDeal handles at-cost offer and unrecorded cost gracefully", () => {
  const atCost = evaluateFairDeal({ totalCost: 600, offerPrice: 600 });
  assert.equal(atCost.status, "at_cost");
  assert.equal(atCost.isBelowCost, false);

  const unrecorded = evaluateFairDeal({ totalCost: 0, offerPrice: 500 });
  assert.equal(unrecorded.status, "unrecorded_cost");
  assert.equal(unrecorded.hasDeclaredCost, false);
});

test("POST /api/products/calculate-pricing rejects unauthenticated requests", async () => {
  const response = await fetch(`${baseUrl}/api/products/calculate-pricing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ materialCost: 300, labourCost: 200 }),
  });
  assert.equal(response.status, 401);
  const data = await response.json();
  assert.equal(data.error.code, "UNAUTHORIZED");
});

test("POST /api/products/calculate-pricing returns calculation for authenticated artisan", async () => {
  const sessionToken = createSessionToken({
    artisanId: "65f000000000000000000001",
    sessionVersion: 0,
  });

  const response = await fetch(`${baseUrl}/api/products/calculate-pricing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `craftigari_session=${sessionToken}`,
    },
    body: JSON.stringify({
      materialCost: 300,
      labourCost: 200,
      packagingCost: 50,
      otherExpenses: 50,
      profitPercentage: 25,
      selectedPrice: 750,
    }),
  });

  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.success, true);
  assert.equal(json.data.totalCost, 600);
  assert.equal(json.data.suggestedPrice, 750);
  assert.equal(json.data.selectedPrice, 750);
  assert.equal(json.data.isBelowCost, false);
});

test("POST /api/products/evaluate-offer evaluates standalone offer for authenticated artisan", async () => {
  const sessionToken = createSessionToken({
    artisanId: "65f000000000000000000001",
    sessionVersion: 0,
  });

  const response = await fetch(`${baseUrl}/api/products/evaluate-offer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `craftigari_session=${sessionToken}`,
    },
    body: JSON.stringify({
      totalCost: 600,
      offerPrice: 450,
      productPrice: 750,
    }),
  });

  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.success, true);
  assert.equal(json.data.isBelowCost, true);
  assert.equal(json.data.belowCostAmount, 150);
  assert.equal(
    json.data.warning,
    "Warning: This offer is ₹150 below your declared production cost.",
  );
});

test("POST /api/products/:productId/fair-deal rejects unauthenticated requests", async () => {
  const response = await fetch(`${baseUrl}/api/products/prod-123/fair-deal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ offerPrice: 500 }),
  });
  assert.equal(response.status, 401);
});

test("POST /api/products/:productId/fair-deal evaluates offer against artisan product costs", async () => {
  const originalFindOne = Product.findOne;
  Product.findOne = (query) => {
    if (query.productId === "prod-123" && query.artisan === "65f000000000000000000001") {
      return Promise.resolve({
        productId: "prod-123",
        title: "Terracotta Vase",
        price: 750,
        pricing: {
          totalCost: 600,
          suggestedPrice: 750,
        },
      });
    }
    return Promise.resolve(null);
  };

  const sessionToken = createSessionToken({
    artisanId: "65f000000000000000000001",
    sessionVersion: 0,
  });

  const response = await fetch(`${baseUrl}/api/products/prod-123/fair-deal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `craftigari_session=${sessionToken}`,
    },
    body: JSON.stringify({ offerPrice: 450 }),
  });

  Product.findOne = originalFindOne;

  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.success, true);
  assert.equal(json.data.productId, "prod-123");
  assert.equal(json.data.isBelowCost, true);
  assert.equal(json.data.belowCostAmount, 150);
  assert.equal(
    json.data.warning,
    "Warning: This offer is ₹150 below your declared production cost.",
  );
});

test("POST /api/products/:productId/fair-deal rejects cross-artisan access", async () => {
  const originalFindOne = Product.findOne;
  Product.findOne = () => Promise.resolve(null);

  const sessionToken = createSessionToken({
    artisanId: "65f000000000000000000002",
    sessionVersion: 0,
  });

  const response = await fetch(`${baseUrl}/api/products/prod-123/fair-deal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `craftigari_session=${sessionToken}`,
    },
    body: JSON.stringify({ offerPrice: 450 }),
  });

  Product.findOne = originalFindOne;

  assert.equal(response.status, 404);
});

test("Product model toJSON strips private pricing when options specify or status is published", () => {
  const doc = new Product({
    productId: "test-prod-1",
    artisan: "65f000000000000000000001",
    title: "Terracotta Vase",
    category: "Pottery",
    craftType: "Terracotta",
    materials: ["Clay"],
    price: 750,
    pricing: {
      materialCost: 300,
      labourCost: 200,
      packagingCost: 50,
      otherExpenses: 50,
      profitPercentage: 25,
      totalCost: 600,
      suggestedPrice: 750,
    },
    status: "published",
  });

  // Public serialization: pricing must be stripped!
  const publicJson = doc.toJSON({ stripPrivatePricing: true });
  assert.equal(publicJson.pricing, undefined);
  assert.equal(publicJson.price, 750);

  // Private artisan serialization: pricing is preserved!
  const privateJson = doc.toJSON({ includePrivatePricing: true });
  assert.ok(privateJson.pricing);
  assert.equal(privateJson.pricing.totalCost, 600);
  assert.equal(privateJson.pricing.materialCost, 300);
});
