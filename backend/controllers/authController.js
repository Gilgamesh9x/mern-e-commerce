import "express-async-errors";
import User from "../models/userModel.js";
import hashPasswords from "../utils/hashPasswords.js";
import { createJWT } from "../utils/tokenUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import bcrypt from "bcryptjs";

// register

export async function register(req, res) {
  const hashedPassword = await hashPasswords(req.body.password);
  req.body.password = hashedPassword;
  // always ovveride the sent role from body to user
  req.body.role = "user";
  await User.create(req.body);
  return res.status(201).json({ message: "User created successfully" });
}

// login

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user && (await bcrypt.compare(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("Invalid Credentials");

  const token = createJWT({
    userId: user._id,
    role: user.role,
    fullName: user.fullName,
  });

  res.cookie("auth", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    message: "Connected Successfully",
    userInfo: {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
}

// log out

export function logout(req, res) {
  res.cookie("auth", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "You logged out successfully." });
}
