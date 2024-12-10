import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

function withValidationErrors(validateValues) {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
}

///////////////////////////////////// Products/Order/User Validation //////////////////////////////////////////////////////////////

export function validateIdParam(model, paramName) {
  return async (req, res, next) => {
    const id = req.params[paramName];

    // Check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError(`Invalid MongoDB ID for ${paramName}`);
    }

    // Check if the document exists
    const document = await model.findById(id);
    if (!document) {
      throw new NotFoundError(`${model.modelName} not found`);
    }

    next();
  };
}

///////////////////////////////////// Auth Validation //////////////////////////////////////////////////////////////

export const validateRegisterInput = withValidationErrors([
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("Email already exists.");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
]);

export const validateLoginInput = withValidationErrors([
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]);

///////////////////////////////////// Update Profile Validation //////////////////////////////////////////////////////////////

export const validateUpdateProfile = withValidationErrors([
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
]);

///////////////////////////////////////////// Validation for Order creation /////////////////////////////////////////////////
export const validateOrderData = withValidationErrors([
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("Order items must be an array with at least one item")
    .custom(async (items) => {
      for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item._id)) {
          throw new BadRequestError(`Invalid product ID: ${item._id}`);
        }
        const product = await Product.findById(item._id);
        if (!product) {
          throw new NotFoundError(`Product not found for ID: ${item._id}`);
        }
      }
      return true;
    }),
  body("orderItems.*.name").notEmpty().withMessage("Item name is required"),
  body("orderItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Item quantity must be at least 1"),
  body("orderItems.*.image").notEmpty().withMessage("Item image is required"),
  body("orderItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Item price must be a positive number"),
  body("shippingAddress.address")
    .notEmpty()
    .withMessage("Shipping address is required"),
  body("shippingAddress.city").notEmpty().withMessage("City is required"),
  body("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code is required"),
  body("shippingAddress.country").notEmpty().withMessage("Country is required"),
  body("itemsPrice")
    .isFloat({ min: 0 })
    .withMessage("Items price must be a positive number"),
  body("shippingPrice")
    .isFloat({ min: 0 })
    .withMessage("Shipping price must be a positive number"),
  body("totalPrice")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a positive number"),
]);

////////////////////////////////////////////// Edit product validation /////////////////////////////////////////////////////////

export const validateUpdateProductData = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("description").notEmpty().withMessage("Description is required"),
  body("brand").notEmpty().withMessage("Brand is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("countInStock")
    .isFloat({ min: 0 })
    .withMessage("Count in stock must be a positive number"),
]);

////////////////////////////////////////////// Create product review /////////////////////////////////////////////////////////

export const validateReviewInput = withValidationErrors([
  body("rating")
    .isNumeric()
    .withMessage("Rating must be a number")
    .custom((value) => value >= 1 && value <= 5)
    .withMessage("Rating must be between 1 and 5"),
]);
