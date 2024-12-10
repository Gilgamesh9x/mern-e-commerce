import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/productsController.js";
import {
  validateIdParam,
  validateUpdateProductData,
  validateReviewInput,
} from "../middleware/validationMiddlewarejs.js";
import {
  authorizePermissions,
  authenticateUser,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import Product from "../models/productModel.js";

const productsRouter = Router();

// Get products
productsRouter.get("/", getProducts);

// Get product
productsRouter.get(
  "/:productId",
  validateIdParam(Product, "productId"),
  getProduct
);

// Create product
productsRouter.post(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  createProduct
);

// Update product
productsRouter.put(
  "/:productId",
  authenticateUser,
  authorizePermissions("admin"),
  validateIdParam(Product, "productId"),
  upload.single("image"),
  validateUpdateProductData,
  updateProduct
);

// Delete product
productsRouter.delete(
  "/:productId",
  authenticateUser,
  authorizePermissions("admin"),
  validateIdParam(Product, "productId"),
  deleteProduct
);

// Create product review
productsRouter.post(
  "/:productId/reviews",
  authenticateUser,
  validateIdParam(Product, "productId"),
  validateReviewInput,
  createProductReview
);

export default productsRouter;
