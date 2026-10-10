import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["buyer", "artisan"],
      required: true,
    },
    senderName: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    proposedPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const keyTakeawaySchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    value: { type: String, trim: true, default: "" },
    tag: { type: String, trim: true, default: null },
  },
  { _id: false },
);

const dealSaathiSchema = new mongoose.Schema(
  {
    summary: { type: String, trim: true, default: "" },
    explanation: { type: String, trim: true, default: "" },
    language: { type: String, trim: true, default: "hi" },
    keyTakeaways: { type: [keyTakeawaySchema], default: [] },
    suggestedReply: { type: String, trim: true, default: "" },
    counterOfferAdvice: { type: String, trim: true, default: "" },
    questionsToAsk: { type: [String], default: [] },
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const inquirySchema = new mongoose.Schema(
  {
    inquiryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artisan",
      required: true,
      index: true,
    },
    artisanId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    buyerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    buyerContact: {
      phone: { type: String, trim: true, default: "", maxlength: 30 },
      email: { type: String, trim: true, default: "", maxlength: 120 },
      organization: { type: String, trim: true, default: "", maxlength: 120 },
      isVerified: { type: Boolean, default: false },
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    buyerMessage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    expectedTimeline: {
      type: String,
      trim: true,
      default: "Standard (15 Days)",
      maxlength: 100,
    },
    proposedPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    counterOfferPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    status: {
      type: String,
      enum: ["new", "in_discussion", "quoted", "closed"],
      default: "new",
      index: true,
    },
    accessTokenHash: {
      type: String,
      required: true,
      index: true,
      select: false,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    dealSaathi: {
      type: dealSaathiSchema,
      default: null,
    },
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_document, value, options = {}) {
        value.id = value._id?.toString() ?? value.id;
        delete value._id;
        delete value.accessTokenHash;

        if (options.forBuyer) {
          delete value.dealSaathi;
        }

        return value;
      },
    },
  },
);

inquirySchema.index({ artisan: 1, status: 1, createdAt: -1 });

export const Inquiry =
  mongoose.models.Inquiry ?? mongoose.model("Inquiry", inquirySchema);
