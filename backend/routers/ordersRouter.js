import { Router } from "express";
import { authorizePermissions } from "../middleware/authMiddleware.js";
import {
  validateOrderData,
  validateIdParam,
} from "../middleware/validationMiddlewarejs.js";
import {
  addOrderItems,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrderToPaid,
  updateIsDelivered,
} from "../controllers/ordersController.js";
import Order from "../models/orderModel.js";

const ordersRouter = Router();

ordersRouter.post("/", validateOrderData, addOrderItems);
ordersRouter.get("/", authorizePermissions("admin"), getOrders);
ordersRouter.get("/myorders", getUserOrders);
ordersRouter.get("/:orderId", validateIdParam(Order, "orderId"), getOrderById);
ordersRouter.put(
  "/:orderId/pay",
  validateIdParam(Order, "orderId"),
  updateOrderToPaid
);
ordersRouter.put(
  "/:orderId/deliver",
  validateIdParam(Order, "orderId"),
  authorizePermissions("admin"),
  updateIsDelivered
);

export default ordersRouter;
