import { createHash, randomBytes } from "node:crypto";
import { connectToDatabase } from "../../config/database.js";
import { ApiError } from "../../utils/ApiError.js";
import { Inquiry } from "../inquiries/inquiry.model.js";
import { Product } from "../products/product.model.js";
import { Quotation } from "./quotation.model.js";

function notFound(message = "Quotation not found") {
  return new ApiError(404, message, { code: "NOT_FOUND" });
}

function forbidden(message = "You do not have access to this quotation") {
  return new ApiError(403, message, { code: "FORBIDDEN" });
}

function hashToken(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}

export async function createQuotationService(artisanId, input) {
  await connectToDatabase();

  const inquiry = await Inquiry.findOne({
    inquiryId: input.inquiryId,
    artisan: artisanId,
  });
  if (!inquiry) {
    throw notFound("Inquiry not found or not owned by you");
  }

  const product = await Product.findOne({
    productId: inquiry.productId,
    artisan: artisanId,
  });
  if (!product) {
    throw notFound("Associated product not found");
  }

  const quantity = Math.max(1, Math.round(Number(input.quantity) || inquiry.quantity || 1));
  const unitPrice = Math.max(0, Math.round(Number(input.unitPrice) || product.price || 0));
  const subtotal = quantity * unitPrice;
  const rawDiscount = Math.round(Number(input.discount) || 0);
  const discount = Math.min(subtotal, Math.max(0, rawDiscount));
  const finalAmount = subtotal - discount;

  const quotationId = `qtn_${randomBytes(6).toString("hex")}`;
  const rawAccessToken = randomBytes(24).toString("hex");
  const accessTokenHash = hashToken(rawAccessToken);

  const quotation = await Quotation.create({
    quotationId,
    inquiry: inquiry._id,
    inquiryId: inquiry.inquiryId,
    product: product._id,
    productId: product.productId,
    artisan: product.artisan,
    artisanId: String(product.artisan),
    buyerName: inquiry.buyerName,
    quantity,
    unitPrice,
    subtotal,
    discount,
    finalAmount,
    notes: input.notes || "",
    timeline: input.timeline || inquiry.expectedTimeline || "15 Days",
    customization: input.customization || "",
    status: input.status || "issued",
    accessTokenHash,
    issuedAt: new Date(),
  });

  inquiry.status = "quoted";
  inquiry.quotationId = quotation._id;
  inquiry.messages.push({
    sender: "artisan",
    senderName: "Artisan",
    message: `प्रस्ताव भेजा गया (Quote Sent): ${quantity} पीस × ₹${unitPrice} = ₹${finalAmount}. ${input.notes || ""}`.trim(),
    proposedPrice: unitPrice,
    createdAt: new Date(),
  });
  await inquiry.save();

  return {
    quotation: quotation.toJSON(),
    accessToken: rawAccessToken,
    publicUrl: `/quote/${quotation.quotationId}?token=${rawAccessToken}`,
  };
}

export async function getQuotationService({ quotationId, artisanId, accessToken }) {
  if (!artisanId && !accessToken) {
    throw new ApiError(401, "Authentication is required", { code: "UNAUTHORIZED" });
  }

  await connectToDatabase();

  const quotation = await Quotation.findOne({ quotationId })
    .populate("product", "title price images category craftType productId")
    .populate("artisan", "name location craftSpecialization profilePhoto");

  if (!quotation) throw notFound();

  // Artisan access
  if (artisanId) {
    const isOwner = String(quotation.artisan._id ?? quotation.artisan) === String(artisanId);
    if (!isOwner) throw forbidden();
    return quotation.toJSON();
  }

  // Buyer access via unguessable token
  if (accessToken) {
    const candidateHash = hashToken(accessToken);
    const storedQuotation = await Quotation.findOne({ quotationId }).select("+accessTokenHash");
    if (storedQuotation?.accessTokenHash === candidateHash) {
      return quotation.toJSON();
    }

    // Also check if matches the linked inquiry's access token
    const linkedInquiry = await Inquiry.findById(quotation.inquiry).select("+accessTokenHash");
    if (linkedInquiry?.accessTokenHash === candidateHash) {
      return quotation.toJSON();
    }

    throw forbidden("Invalid or expired quotation access token");
  }

  throw new ApiError(401, "Authentication is required", { code: "UNAUTHORIZED" });
}

export async function updateQuotationStatusService({ quotationId, artisanId, accessToken, status }) {
  await connectToDatabase();

  const quotation = await Quotation.findOne({ quotationId });
  if (!quotation) throw notFound();

  let isAuthorized = false;
  if (artisanId && String(quotation.artisan) === String(artisanId)) {
    isAuthorized = true;
  } else if (accessToken) {
    const candidateHash = hashToken(accessToken);
    const stored = await Quotation.findOne({ quotationId }).select("+accessTokenHash");
    if (stored?.accessTokenHash === candidateHash) {
      isAuthorized = true;
    } else {
      const linkedInquiry = await Inquiry.findById(quotation.inquiry).select("+accessTokenHash");
      if (linkedInquiry?.accessTokenHash === candidateHash) {
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    throw forbidden("Unauthorized to modify this quotation");
  }

  quotation.status = status;
  await quotation.save();

  if (status === "accepted" || status === "declined") {
    await Inquiry.findByIdAndUpdate(quotation.inquiry, {
      status: status === "accepted" ? "closed" : "in_discussion",
      $push: {
        messages: {
          sender: "buyer",
          senderName: quotation.buyerName,
          message: status === "accepted" ? "Buyer accepted the quotation." : "Buyer requested changes / declined the quotation.",
          createdAt: new Date(),
        },
      },
    });
  }

  return quotation.toJSON();
}
