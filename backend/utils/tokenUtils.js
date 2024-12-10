import * as dotenv from "dotenv";
dotenv.config();
// we added dotenv config here because this file executes before the app.js does and therefore the variables from env are undefined
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/customErrors.js";

export function createJWT(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
}

export function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new UnauthenticatedError("Invalid token");
  }
}
