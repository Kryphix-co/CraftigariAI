import { sendSuccess } from "../../utils/response.js";
import {
  calculatePricingService,
  createProductDraft,
  evaluateProductOfferService,
  evaluateStandaloneOfferService,
  getOwnedProduct,
  getPublishedProduct,
  listProductsByArtisan,
  listPublishedProducts,
  publishProductDraft,
  updateProductDraft,
} from "./product.service.js";

export async function calculatePricing(request, response) {
  const result = calculatePricingService(request.validated.body);
  return sendSuccess(response, {
    data: result,
    message: "Pricing calculated successfully",
  });
}

export async function evaluateProductOffer(request, response) {
  const result = await evaluateProductOfferService(
    request.validated.params.productId,
    request.auth.artisanId,
    request.validated.body,
  );
  return sendSuccess(response, {
    data: result,
    message: "Offer evaluated successfully",
  });
}

export async function evaluateStandaloneOffer(request, response) {
  const result = evaluateStandaloneOfferService(request.validated.body);
  return sendSuccess(response, {
    data: result,
    message: "Offer evaluated successfully",
  });
}

export async function createDraft(request, response) {
  const product = await createProductDraft(
    request.auth.artisanId,
    request.validated.body,
  );
  return sendSuccess(response, {
    data: product,
    message: "Product draft created",
    statusCode: 201,
  });
}

export async function updateDraft(request, response) {
  const product = await updateProductDraft(
    request.validated.params.productId,
    request.auth.artisanId,
    request.validated.body,
  );
  return sendSuccess(response, { data: product, message: "Product draft updated" });
}

export async function getProduct(request, response) {
  const product = await getOwnedProduct(
    request.validated.params.productId,
    request.auth.artisanId,
  );
  return sendSuccess(response, { data: product });
}

export async function publishDraft(request, response) {
  const product = await publishProductDraft(
    request.validated.params.productId,
    request.auth.artisanId,
  );
  return sendSuccess(response, { data: product, message: "Product published" });
}

export async function listPublished(request, response) {
  const result = await listPublishedProducts(request.validated.query);
  return sendSuccess(response, { data: result });
}

export async function getPublished(request, response) {
  const product = await getPublishedProduct(request.validated.params.productId);
  return sendSuccess(response, { data: product });
}

export async function listForArtisan(request, response) {
  const result = await listProductsByArtisan(
    request.validated.params.artisanId,
    request.validated.query,
  );
  return sendSuccess(response, { data: result });
}
