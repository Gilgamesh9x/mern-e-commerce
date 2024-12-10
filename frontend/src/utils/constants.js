import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://mern-e-commerce-mrt2.onrender.com/api";

console.log(API_URL);
