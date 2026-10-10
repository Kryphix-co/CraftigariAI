import { createHash } from "node:crypto";
import { connectToDatabase } from "../../config/database.js";
import { ApiError } from "../../utils/ApiError.js";
import { Order } from "./order.model.js";
import { Quotation } from "../quotations/quotation.model.js";
import { Inquiry } from "../inquiries/inquiry.model.js";

function hashToken(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}

export async function getOrderByNumberService({ orderNumber, token, artisanId }) {
  if (!token && !artisanId) {
    throw new ApiError(401, "Authentication or order access token is required", {
      code: "UNAUTHORIZED",
    });
  }

  await connectToDatabase();

  const order = await Order.findOne({ orderNumber })
    .populate("product", "title price images category craftType productId")
    .populate("artisan", "name location craftSpecialization profilePhoto")
    .populate("quotation", "quotationId timeline notes customization subtotal discount finalAmount status");

  if (!order) {
    throw new ApiError(404, "Order not found", { code: "NOT_FOUND" });
  }

  // Artisan ownership check
  if (artisanId) {
    const isOwner = String(order.artisan?._id ?? order.artisan) === String(artisanId);
    if (!isOwner) {
      throw new ApiError(403, "You do not have access to this order", {
        code: "FORBIDDEN",
      });
    }
    return order.toJSON();
  }

  // Guest buyer access via unguessable token
  if (token) {
    const candidateHash = hashToken(token);
    const stored = await Order.findOne({ orderNumber }).select("+accessTokenHash");
    if (stored?.accessTokenHash === candidateHash) {
      return order.toJSON();
    }

    // Also check linked quotation or inquiry token
    if (order.quotation) {
      const qtn = await Quotation.findById(order.quotation).select("+accessTokenHash");
      if (qtn?.accessTokenHash === candidateHash) {
        return order.toJSON();
      }
    }

    if (order.inquiry) {
      const inq = await Inquiry.findById(order.inquiry).select("+accessTokenHash");
      if (inq?.accessTokenHash === candidateHash) {
        return order.toJSON();
      }
    }

    throw new ApiError(403, "Invalid order access token", { code: "FORBIDDEN" });
  }

  throw new ApiError(401, "Unauthorized access", { code: "UNAUTHORIZED" });
}

export async function getArtisanOrdersService(artisanId, { status = "all" } = {}) {
  await connectToDatabase();

  const query = {
    artisan: artisanId,
    // Only show genuine paid orders to artisan, preventing unconfirmed/abandoned carts from showing as purchases
    paymentStatus: "paid",
  };

  const normStatus = status.toLowerCase();
  if (normStatus === "active") {
    query.orderStatus = { $in: ["confirmed", "processing"] };
  } else if (normStatus === "delivered" || normStatus === "completed") {
    query.orderStatus = "completed";
  } else if (["confirmed", "processing", "cancelled"].includes(normStatus)) {
    query.orderStatus = normStatus;
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate("product", "title images price productId");

  return {
    orders: orders.map((o) => o.toJSON()),
    total: orders.length,
  };
}

export async function updateArtisanOrderStatusService({
  orderNumber,
  artisanId,
  orderStatus,
}) {
  await connectToDatabase();

  const order = await Order.findOne({ orderNumber });
  if (!order) {
    throw new ApiError(404, "Order not found", { code: "NOT_FOUND" });
  }

  const isOwner = String(order.artisan) === String(artisanId);
  if (!isOwner) {
    throw new ApiError(403, "You do not have access to update this order", {
      code: "FORBIDDEN",
    });
  }

  if (order.paymentStatus !== "paid") {
    throw new ApiError(400, "Cannot change fulfillment status for an unpaid order", {
      code: "ORDER_NOT_PAID",
    });
  }

  const allowedStatuses = new Set(["processing", "completed", "cancelled"]);
  if (!allowedStatuses.has(orderStatus)) {
    throw new ApiError(400, "Invalid order status transition", {
      code: "INVALID_STATUS_TRANSITION",
    });
  }

  // Never touch paymentStatus! Only fulfillment orderStatus
  order.orderStatus = orderStatus;
  await order.save();

  return order.toJSON();
}
