import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    quotationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    inquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inquiry",
      required: true,
      index: true,
    },
    inquiryId: {
      type: String,
      required: true,
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    timeline: {
      type: String,
      trim: true,
      default: "15 Days",
      maxlength: 100,
    },
    customization: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
    validUntil: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "issued", "accepted", "declined"],
      default: "issued",
      index: true,
    },
    accessTokenHash: {
      type: String,
      required: true,
      index: true,
      select: false,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    orderNumber: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_document, value) {
        value.id = value._id?.toString() ?? value.id;
        delete value._id;
        delete value.accessTokenHash;
        return value;
      },
    },
  },
);

quotationSchema.index({ artisan: 1, status: 1, createdAt: -1 });

export const Quotation =
  mongoose.models.Quotation ?? mongoose.model("Quotation", quotationSchema);
