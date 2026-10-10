import mongoose from "mongoose";

const deliveryAddressSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "", maxlength: 120 },
    phone: { type: String, trim: true, default: "", maxlength: 30 },
    street: { type: String, trim: true, default: "", maxlength: 300 },
    city: { type: String, trim: true, default: "", maxlength: 100 },
    state: { type: String, trim: true, default: "", maxlength: 100 },
    pincode: { type: String, trim: true, default: "", maxlength: 20 },
  },
  { _id: false },
);

const termsSnapshotSchema = new mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    timeline: { type: String, default: "" },
    customization: { type: String, default: "" },
    notes: { type: String, default: "" },
    acceptedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const buyerContactSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true, default: "", maxlength: 30 },
    email: { type: String, trim: true, default: "", maxlength: 120 },
    organization: { type: String, trim: true, default: "", maxlength: 120 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      required: true,
      index: true,
    },
    quotationId: {
      type: String,
      required: true,
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
    buyerContact: {
      type: buyerContactSchema,
      default: () => ({}),
    },
    deliveryAddress: {
      type: deliveryAddressSchema,
      default: () => ({}),
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
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
    },
    termsSnapshot: {
      type: termsSnapshotSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "razorpay",
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ["awaiting_payment", "confirmed", "processing", "completed", "cancelled"],
      default: "awaiting_payment",
      index: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      index: true,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: null,
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: null,
    },
    accessTokenHash: {
      type: String,
      required: true,
      index: true,
      select: false,
    },
    paidAt: {
      type: Date,
      default: null,
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

orderSchema.index({ artisan: 1, orderStatus: 1, createdAt: -1 });
orderSchema.index({ quotation: 1, paymentStatus: 1 });

export const Order =
  mongoose.models.Order ?? mongoose.model("Order", orderSchema);
