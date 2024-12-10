import "express-async-errors";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { BadRequestError } from "../errors/customErrors.js";
/* return res.status(500).json({ message: "Something wrong happened" }); */

export async function getProducts(req, res) {
  const { page, searchTerm } = req.query;

  const queryObject = {};

  if (searchTerm) {
    queryObject.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }
  console.log(queryObject);

  ////////////////////////////// Pagination Logic ////////////////////////////////////////////////////////////////////////
  const pageNumber = +page || 1;

  const limit = 4;

  const skip = (pageNumber - 1) * limit;

  const products = await Product.find(queryObject).skip(skip).limit(limit);

  const totalProducts = await Product.countDocuments(queryObject);
  const totalPages = Math.ceil(totalProducts / limit);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return res.status(200).json({ products, totalProducts, totalPages });
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.productId);
  return res.status(200).json(product);
}

export async function createProduct(req, res) {
  await Product.create({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/src/assets/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  return res.status(201).json({ message: "Product created successfully" });
}

export async function updateProduct(req, res) {
  let image = req.body.image;
  let imagePublicId;

  if (req?.file?.path) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    await fs.unlink(req.file.path); // Deletes the temporary file in the disk
    image = uploadResult.secure_url;
    imagePublicId = uploadResult.public_id;
  }

  const { productId } = req.params;
  const { name, price, description, brand, category, countInStock } = req.body;

  const updateObject = {
    name,
    price,
    description,
    brand,
    category,
    countInStock,
    image,
  };

  if (imagePublicId) {
    updateObject.imagePublicId = imagePublicId;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: productId },
    updateObject
  );

  // if the product already had an image, delete it
  if (req?.file?.path && updatedProduct.productPublicId) {
    await cloudinary.uploader.destroy(updatedProduct.productPublicId);
  }
  return res
    .status(201)
    .json({ message: "Product updated successfully", updatedProduct });
}

export async function deleteProduct(req, res) {
  const { productId } = req.params;
  await Product.findByIdAndDelete({ _id: productId });
  return res.status(200).json({ message: "Product deleted successfully" });
}

// Create product review

export async function createProductReview(req, res) {
  const { productId } = req.params;
  const { userId, fullName } = req.user;
  const { rating, comment } = req.body;

  const product = await Product.findById(productId);

  // since product.reviews.user is a mongo id, we need to stringify it and then compare because userId is a stringified mongo id
  const hasUserAlreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === userId
  );

  if (hasUserAlreadyReviewed) {
    throw new BadRequestError("You have already reviewed this product.");
  }
  console.log(fullName);

  const review = {
    user: userId,
    name: fullName,
    rating: +rating,
    comment,
  };

  // push the new review
  product.reviews.push(review);

  // update the number of reviews
  product.numReviews = product.reviews.length;

  // update the rating
  product.rating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.reviews.length;

  await product.save();

  return res.status(201).json({ message: "Review created successfully" });
}
