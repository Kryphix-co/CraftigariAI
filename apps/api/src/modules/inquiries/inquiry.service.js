import { createHash, randomBytes } from "node:crypto";
import { connectToDatabase } from "../../config/database.js";
import { ApiError } from "../../utils/ApiError.js";
import { Product } from "../products/product.model.js";
import { evaluateFairDeal } from "../products/pricing.calculator.js";
import { requestAiAnalysis } from "../ai/ai.service.js";
import { Inquiry } from "./inquiry.model.js";

function notFound(message = "Inquiry not found") {
  return new ApiError(404, message, { code: "NOT_FOUND" });
}

function forbidden(message = "You do not have access to this inquiry") {
  return new ApiError(403, message, { code: "FORBIDDEN" });
}

function hashToken(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}

function pagination(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function buildFallbackDealSaathi({
  buyerMessage = "",
  productTitle = "",
  quantity = null,
  proposedPrice = null,
  language = "hi",
}) {
  const isHindi = language.startsWith("hi");
  const msg = buyerMessage.toLowerCase();

  const keyTakeaways = [];
  if (quantity) {
    keyTakeaways.push({
      label: isHindi ? "मात्रा (Quantity)" : "Quantity",
      value: isHindi ? `${quantity} पीस` : `${quantity} units`,
      tag: quantity >= 50 ? (isHindi ? "बड़ा ऑर्डर" : "Bulk order") : null,
    });
  }

  if (proposedPrice) {
    keyTakeaways.push({
      label: isHindi ? "प्रस्तावित दर (Proposed Price)" : "Proposed Price",
      value: isHindi ? `₹${proposedPrice} / पीस` : `₹${proposedPrice} / unit`,
      tag: isHindi ? "खरीदार का प्रस्ताव" : "Buyer Offer",
    });
  }

  if (/(custom|colour|color|red|finish|बदलाव|रंग|लेप)/i.test(msg)) {
    keyTakeaways.push({
      label: isHindi ? "कस्टमाइज़ेशन (Customization)" : "Customization",
      value: isHindi ? "विशेष रंग या फिनिश की मांग" : "Custom finish or design requested",
      tag: isHindi ? "कस्टम" : "Custom",
    });
  }

  if (/(days|timeline|urgent|जल्द|दिन)/i.test(msg)) {
    keyTakeaways.push({
      label: isHindi ? "समय सीमा (Timeline)" : "Timeline",
      value: isHindi ? "15 दिनों के अंदर डिलीवरी" : "Delivery within 15 days",
      tag: isHindi ? "समय सीमा" : "Timeline",
    });
  }

  if (/(delivery|shipping|mumbai|delhi|स्थान|डिलीवरी)/i.test(msg)) {
    keyTakeaways.push({
      label: isHindi ? "स्थान / डिलीवरी" : "Location / Delivery",
      value: isHindi ? "डिलीवरी स्थान और भाड़ा स्पष्ट करें" : "Confirm delivery location & freight",
      tag: null,
    });
  }

  if (keyTakeaways.length === 0) {
    keyTakeaways.push({
      label: isHindi ? "पूछताछ विवरण" : "Inquiry Details",
      value: isHindi ? "विस्तृत विवरण संदेश में देखें" : "Review full message details",
      tag: null,
    });
  }

  return {
    summary: isHindi
      ? `खरीदार ने ${productTitle || "उत्पाद"} के लिए पूछताछ भेजी है।`
      : `Buyer sent an inquiry for ${productTitle || "your craft"}.`,
    explanation: isHindi
      ? `खरीदार आपके उत्पाद ${productTitle || ""} के लिए पूछताछ कर रहे हैं। मात्रा, समय और दर की पुष्टि करके कोटेशन भेजें।`
      : `Buyer is requesting details for ${productTitle || "your product"}. Verify quantity and timeline before quoting.`,
    language,
    keyTakeaways,
    suggested_reply: isHindi
      ? `नमस्ते, ${productTitle || "उत्पाद"} में रुचि के लिए धन्यवाद। हम आपके ऑर्डर पर काम करने के लिए तैयार हैं। कृपया डिलीवरी की अंतिम तारीख और पता बताएं ताकि हम कोटेशन तैयार कर सकें।`
      : `Hello, thank you for your inquiry about ${productTitle || "our product"}. We are ready to fulfill your request. Please confirm your delivery deadline and location.`,
    suggestedReply: isHindi
      ? `नमस्ते, ${productTitle || "उत्पाद"} में रुचि के लिए धन्यवाद। हम आपके ऑर्डर पर काम करने के लिए तैयार हैं। कृपया डिलीवरी की अंतिम तारीख और पता बताएं ताकि हम कोटेशन तैयार कर सकें।`
      : `Hello, thank you for your inquiry about ${productTitle || "our product"}. We are ready to fulfill your request. Please confirm your delivery deadline and location.`,
    counterOfferAdvice: isHindi
      ? "अपने घोषित उत्पादन लागत से नीचे मोलभाव न करें। फेयर डील शील्ड की जांच करके ही अंतिम दर तय करें।"
      : "Ensure your unit price covers production costs and includes a fair profit margin.",
    questionsToAsk: isHindi
      ? [
          "क्या आपको किसी निश्चित तारीख तक डिलीवरी चाहिए?",
          "क्या पैकेजिंग या फिनिश में कोई विशेष बदलाव चाहिए?",
        ]
      : [
          "What is your target delivery deadline?",
          "Do you have any specific packaging or finish preferences?",
        ],
    generatedAt: new Date(),
  };
}

export async function createInquiryService(input) {
  await connectToDatabase();

  const product = await Product.findOne({ productId: input.productId });
  if (!product) {
    throw notFound("Product not found");
  }

  if (product.status !== "published") {
    throw new ApiError(422, "This product is not currently available for inquiries", {
      code: "PRODUCT_UNAVAILABLE",
    });
  }

  const inquiryId = `inq_${randomBytes(6).toString("hex")}`;
  const rawAccessToken = randomBytes(24).toString("hex");
  const accessTokenHash = hashToken(rawAccessToken);

  const initialMessage = {
    sender: "buyer",
    senderName: input.buyerName,
    message: input.buyerMessage,
    proposedPrice: input.proposedPrice ?? null,
    createdAt: new Date(),
  };

  const inquiry = await Inquiry.create({
    inquiryId,
    product: product._id,
    productId: product.productId,
    artisan: product.artisan,
    artisanId: String(product.artisan),
    buyerName: input.buyerName,
    buyerContact: {
      phone: input.buyerPhone || "",
      email: input.buyerEmail || "",
      organization: input.buyerOrganization || "",
      isVerified: false,
    },
    quantity: input.quantity,
    buyerMessage: input.buyerMessage,
    expectedTimeline: input.expectedTimeline || "Standard (15 Days)",
    proposedPrice: input.proposedPrice ?? null,
    status: "new",
    accessTokenHash,
    messages: [initialMessage],
  });

  return {
    inquiry: inquiry.toJSON({ forBuyer: true }),
    accessToken: rawAccessToken,
  };
}

export async function listArtisanInquiriesService(artisanId, { page = 1, limit = 20, status = "all" } = {}) {
  await connectToDatabase();

  const query = { artisan: artisanId };
  if (status !== "all") {
    query.status = status;
  }

  const [items, total] = await Promise.all([
    Inquiry.find(query)
      .populate("product", "title price images category productId")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Inquiry.countDocuments(query),
  ]);

  return {
    items: items.map((doc) => doc.toJSON({ forArtisan: true })),
    pagination: pagination(page, limit, total),
  };
}

export async function getInquiryDetailsService({ inquiryId, artisanId, accessToken }) {
  if (!artisanId && !accessToken) {
    throw new ApiError(401, "Authentication is required", { code: "UNAUTHORIZED" });
  }

  await connectToDatabase();

  const inquiry = await Inquiry.findOne({ inquiryId })
    .populate("product", "title price images category craftType productId")
    .populate("artisan", "name location craftSpecialization profilePhoto");

  if (!inquiry) throw notFound();

  // Artisan access
  if (artisanId) {
    const isOwner = String(inquiry.artisan._id ?? inquiry.artisan) === String(artisanId);
    if (!isOwner) throw forbidden();
    return inquiry.toJSON({ forArtisan: true });
  }

  // Guest buyer access via secure token
  if (accessToken) {
    const candidateHash = hashToken(accessToken);
    const storedInquiry = await Inquiry.findOne({ inquiryId }).select("+accessTokenHash");
    if (!storedInquiry || storedInquiry.accessTokenHash !== candidateHash) {
      throw forbidden("Invalid or expired access token");
    }
    return inquiry.toJSON({ forBuyer: true });
  }

  throw new ApiError(401, "Authentication is required", { code: "UNAUTHORIZED" });
}

export async function addInquiryMessageService({
  inquiryId,
  artisanId,
  accessToken,
  message,
  counterOfferPrice,
  status,
}) {
  await connectToDatabase();

  const inquiry = await Inquiry.findOne({ inquiryId });
  if (!inquiry) throw notFound();

  let sender = "artisan";
  let senderName = "Artisan";

  if (artisanId) {
    if (String(inquiry.artisan) !== String(artisanId)) throw forbidden();
    sender = "artisan";
  } else if (accessToken) {
    const candidateHash = hashToken(accessToken);
    const stored = await Inquiry.findOne({ inquiryId }).select("+accessTokenHash");
    if (!stored || stored.accessTokenHash !== candidateHash) {
      throw forbidden("Invalid access token");
    }
    sender = "buyer";
    senderName = inquiry.buyerName;
  } else {
    throw new ApiError(401, "Authentication is required", { code: "UNAUTHORIZED" });
  }

  inquiry.messages.push({
    sender,
    senderName,
    message,
    proposedPrice: counterOfferPrice ?? null,
    createdAt: new Date(),
  });

  if (counterOfferPrice !== undefined && counterOfferPrice !== null) {
    inquiry.counterOfferPrice = counterOfferPrice;
  }

  if (status) {
    inquiry.status = status;
  } else if (inquiry.status === "new") {
    inquiry.status = "in_discussion";
  }

  await inquiry.save();
  return inquiry.toJSON({ forArtisan: Boolean(artisanId), forBuyer: !artisanId });
}

export async function getInquiryFairDealService({ inquiryId, artisanId }) {
  await connectToDatabase();

  const inquiry = await Inquiry.findOne({ inquiryId, artisan: artisanId });
  if (!inquiry) throw notFound();

  const product = await Product.findOne({ productId: inquiry.productId });
  if (!product) throw notFound("Associated product not found");

  const totalCost = product.pricing?.totalCost || 0;
  const suggestedPrice = product.pricing?.suggestedPrice || product.price || 0;

  if (inquiry.proposedPrice === null || inquiry.proposedPrice === undefined) {
    return {
      inquiryId: inquiry.inquiryId,
      productId: product.productId,
      productTitle: product.title,
      hasBuyerOffer: false,
      totalCost,
      suggestedPrice,
      counterOfferPrice: inquiry.counterOfferPrice ?? suggestedPrice,
      warning: "The buyer did not propose a target price. You can propose your own rate in a quotation.",
    };
  }

  const evaluation = evaluateFairDeal({
    totalCost,
    offerPrice: inquiry.proposedPrice,
    productPrice: product.price,
    suggestedPrice,
  });

  return {
    inquiryId: inquiry.inquiryId,
    productId: product.productId,
    productTitle: product.title,
    hasBuyerOffer: true,
    quantity: inquiry.quantity,
    offerPrice: inquiry.proposedPrice,
    totalCost,
    suggestedPrice,
    counterOfferPrice: inquiry.counterOfferPrice ?? suggestedPrice,
    ...evaluation,
  };
}

export async function getInquiryDealSaathiService({ inquiryId, artisanId, language = "hi" }) {
  await connectToDatabase();

  const inquiry = await Inquiry.findOne({ inquiryId, artisan: artisanId });
  if (!inquiry) throw notFound();

  // If already analyzed for this language, return cached dealSaathi
  if (inquiry.dealSaathi && inquiry.dealSaathi.language === language) {
    return inquiry.dealSaathi;
  }

  const product = await Product.findOne({ productId: inquiry.productId });
  const productTitle = product?.title || "";

  let result;
  try {
    const aiPayload = {
      buyer_message: inquiry.buyerMessage,
      product_title: productTitle,
      quantity: inquiry.quantity,
      proposed_price: inquiry.proposedPrice,
      language,
    };
    result = await requestAiAnalysis(artisanId, "/api/deal-saathi", aiPayload);
  } catch {
    // Graceful fallback to rule-based engine if AI service is not running
    result = buildFallbackDealSaathi({
      buyerMessage: inquiry.buyerMessage,
      productTitle,
      quantity: inquiry.quantity,
      proposedPrice: inquiry.proposedPrice,
      language,
    });
  }

  const dealSaathiData = {
    summary: result.summary,
    explanation: result.explanation,
    language,
    keyTakeaways: (result.key_takeaways || result.keyTakeaways || []).map((t) => ({
      label: t.label,
      value: t.value,
      tag: t.tag ?? null,
    })),
    suggestedReply: result.suggested_reply || result.suggestedReply || "",
    counterOfferAdvice: result.counter_offer_advice || result.counterOfferAdvice || "",
    questionsToAsk: result.questions_to_ask || result.questionsToAsk || [],
    generatedAt: new Date(),
  };

  inquiry.dealSaathi = dealSaathiData;
  await inquiry.save();

  return dealSaathiData;
}
