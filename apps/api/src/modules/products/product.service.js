import { randomUUID } from "node:crypto";
import { connectToDatabase } from "../../config/database.js";
import { ApiError } from "../../utils/ApiError.js";
import { Artisan } from "../artisans/artisan.model.js";
import {
  calculateSmartPricing,
  evaluateFairDeal,
} from "./pricing.calculator.js";
import { Product } from "./product.model.js";

function notFound() {
  return new ApiError(404, "Product not found", { code: "PRODUCT_NOT_FOUND" });
}

function pagination(page, limit, total) {
  return {
    page,
    limit,
    total,
    pages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}

export async function createProductDraft(artisanId, input) {
  await connectToDatabase();
  const artisanExists = await Artisan.exists({ _id: artisanId });
  if (!artisanExists) {
    throw new ApiError(404, "Artisan not found", { code: "ARTISAN_NOT_FOUND" });
  }

  const product = await Product.create({
    ...input,
    artisan: artisanId,
    productId: randomUUID(),
    status: "draft",
  });
  return product.toJSON();
}

export async function updateProductDraft(productId, artisanId, input) {
  await connectToDatabase();
  const product = await Product.findOneAndUpdate(
    { productId, artisan: artisanId, status: "draft" },
    { $set: input },
    { new: true, runValidators: true },
  );
  if (!product) throw notFound();
  return product.toJSON();
}

export { calculateSmartPricing, evaluateFairDeal };

export function calculatePricingService(input) {
  return calculateSmartPricing(input);
}

export async function evaluateProductOfferService(productId, artisanId, input) {
  await connectToDatabase();
  const product = await Product.findOne({ productId, artisan: artisanId });
  if (!product) throw notFound();

  const totalCost = product.pricing?.totalCost || input.totalCost || 0;
  const suggestedPrice = product.pricing?.suggestedPrice || product.price || 0;
  const productPrice = product.price || 0;

  const evaluation = evaluateFairDeal({
    totalCost,
    offerPrice: input.offerPrice,
    productPrice,
    suggestedPrice,
  });

  return {
    productId: product.productId,
    productTitle: product.title || "Untitled Product",
    quantity: input.quantity || 1,
    counterOfferPrice: input.counterOfferPrice ?? null,
    ...evaluation,
  };
}

export function evaluateStandaloneOfferService(input) {
  return evaluateFairDeal(input);
}

export async function getOwnedProduct(productId, artisanId) {
  await connectToDatabase();
  const product = await Product.findOne({ productId, artisan: artisanId });
  if (!product) throw notFound();
  return product.toJSON({ includePrivatePricing: true });
}

export async function publishProductDraft(productId, artisanId) {
  await connectToDatabase();
  const product = await Product.findOne({ productId, artisan: artisanId });
  if (!product) throw notFound();
  if (product.status === "published") {
    return product.toJSON({ includePrivatePricing: true });
  }

  const missingFields = product.getPublishValidationErrors();
  if (missingFields.length) {
    throw new ApiError(422, "Draft is not ready to publish", {
      code: "DRAFT_INCOMPLETE",
      details: missingFields.map((field) => ({
        field,
        message: "Required before publishing",
      })),
    });
  }

  product.status = "published";
  product.publishedAt = new Date();
  await product.save();
  return product.toJSON({ includePrivatePricing: true });
}

export async function listPublishedProducts({ page, limit, artisanId }) {
  await connectToDatabase();
  const query = { status: "published" };
  if (artisanId) query.artisan = artisanId;
  const [items, total] = await Promise.all([
    Product.find(query)
      .populate("artisan", "name location craftSpecialization profilePhoto")
      .sort({ publishedAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(query),
  ]);
  return {
    items: items.map((product) => {
      const json = product.toJSON({ stripPrivatePricing: true });
      delete json.pricing;
      return json;
    }),
    pagination: pagination(page, limit, total),
  };
}

export async function getPublishedProduct(productId) {
  await connectToDatabase();
  const product = await Product.findOne({ productId, status: "published" }).populate(
    "artisan",
    "name location craftSpecialization profilePhoto bio",
  );
  if (!product) throw notFound();
  const json = product.toJSON({ stripPrivatePricing: true });
  delete json.pricing;
  return json;
}

export async function listProductsByArtisan(artisanId, { page, limit, status }) {
  await connectToDatabase();
  const query = { artisan: artisanId };
  if (status !== "all") query.status = status;

  const [items, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(query),
  ]);
  return {
    items: items.map((product) => product.toJSON()),
    pagination: pagination(page, limit, total),
  };
}
