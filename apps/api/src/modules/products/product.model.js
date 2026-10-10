import mongoose from "mongoose";

const makingProcessStepSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true, maxlength: 100 },
    stage: { type: String, trim: true, default: "custom", maxlength: 80 },
    title: { type: String, trim: true, default: "", maxlength: 120 },
    description: { type: String, trim: true, default: "", maxlength: 2000 },
    imageUrl: { type: String, trim: true, default: "" },
    order: { type: Number, required: true, min: 0, max: 4 },
  },
  { _id: false },
);

const pricingSchema = new mongoose.Schema(
  {
    materialCost: { type: Number, default: 0, min: 0 },
    labourCost: { type: Number, default: 0, min: 0 },
    packagingCost: { type: Number, default: 0, min: 0 },
    otherExpenses: { type: Number, default: 0, min: 0 },
    profitPercentage: { type: Number, default: 25, min: 0, max: 1000 },
    totalCost: { type: Number, default: 0, min: 0 },
    suggestedPrice: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artisan",
      required: true,
      index: true,
    },
    title: { type: String, trim: true, default: "", maxlength: 160 },
    description: { type: String, trim: true, default: "", maxlength: 5000 },
    category: { type: String, trim: true, default: "", maxlength: 120 },
    craftType: { type: String, trim: true, default: "", maxlength: 120 },
    materials: {
      type: [{ type: String, trim: true, maxlength: 120 }],
      default: [],
    },
    colours: {
      type: [{ type: String, trim: true, maxlength: 120 }],
      default: [],
    },
    tags: {
      type: [{ type: String, trim: true, maxlength: 80 }],
      default: [],
    },
    effort: { type: String, trim: true, default: "", maxlength: 500 },
    size: { type: String, trim: true, default: "", maxlength: 120 },
    price: { type: Number, default: null, min: 0 },
    pricing: { type: pricingSchema, default: null },
    images: { type: [{ type: String, trim: true }], default: [] },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    makingProcess: { type: [makingProcessStepSchema], default: [] },
    publishedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_document, value, options) {
        value.id = value.productId;
        delete value._id;
        delete value.productId;
        if (options?.stripPrivatePricing || (value.status === "published" && !options?.includePrivatePricing)) {
          delete value.pricing;
        }
        return value;
      },
    },
  },
);

productSchema.index({ artisan: 1, status: 1, createdAt: -1 });
productSchema.index({ status: 1, publishedAt: -1 });

productSchema.methods.getPublishValidationErrors = function () {
  const requiredStrings = ["title", "description", "category", "craftType"];
  const missing = requiredStrings.filter((field) => !this[field]?.trim());
  if (!this.materials.length) missing.push("materials");
  if (!(this.price > 0)) missing.push("price");
  if (!this.images.length) missing.push("images");
  return missing;
};

export const Product =
  mongoose.models.Product ?? mongoose.model("Product", productSchema);
