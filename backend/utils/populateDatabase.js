import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import mongoose from "mongoose";

import users from "../data/users.js";
import products from "../data/products.js";

import User from "../models/userModel.js";
import Product from "../models/productModel.js";

console.log(process.env.MONGO_URI);

try {
  await mongoose.connect(process.env.MONGO_URI);

  const createdUsers = await User.create(users);
  const adminId = createdUsers.find((user) => user.isAdmin === true)._id;

  // let's add the property user to the products
  const sampleProducts = products.map((product) => {
    return { ...product, user: adminId };
  });

  const createdProducts = await Product.create(sampleProducts);

  console.log("success");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
