import { Router } from "express";
import {
  optionalArtisanSession,
  requireArtisanSession,
} from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  validateOrderQuery,
  validateUpdateOrderStatus,
} from "./order.validation.js";
import {
  getArtisanOrders,
  getOrderByNumber,
  updateArtisanOrderStatus,
} from "./order.controller.js";

export const orderRouter = Router();

orderRouter.get(
  "/",
  requireArtisanSession,
  validateRequest({ query: validateOrderQuery }),
  getArtisanOrders,
);

orderRouter.get("/:orderNumber", optionalArtisanSession, getOrderByNumber);

orderRouter.patch(
  "/:orderNumber/status",
  requireArtisanSession,
  validateRequest({ body: validateUpdateOrderStatus }),
  updateArtisanOrderStatus,
);
