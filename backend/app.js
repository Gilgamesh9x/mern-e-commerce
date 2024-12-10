//////////////////////////////////////////////// Imports For Packages //////////////////////////////////////////////////////
import * as dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import helmet from "helmet";
// Public folder
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

///////////////////////////////////////////////// Other Imports /////////////////////////////////////////////////////////////
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

import productsRouter from "./routers/productsRouter.js";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import ordersRouter from "./routers/ordersRouter.js";

////////////////////////////////////////// Middleware ///////////////////////////////////////////////////////////////////

const app = express();
const isDevelopment = process.env.NODE_ENV === "development";

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://www.paypal.com",
        "https://www.sandbox.paypal.com",
      ],
      connectSrc: [
        "'self'",
        "https://www.paypal.com",
        "https://www.sandbox.paypal.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://res.cloudinary.com",
        "https://www.paypalobjects.com",
      ],
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

if (isDevelopment) {
  app.use(morgan("dev"));
}

////////////////////////////////////////// Cloudinary /////////////////////////////////////////////////////////////////////////

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/////////////////////////////////////// Routers /////////////////////////////////////////////////////////////////////////

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", authenticateUser, userRouter);
app.use("/api/orders", authenticateUser, ordersRouter);

//////////////////////////////////////////// Serving files ////////////////////////////////////////////////////////////////

// Serve static files
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "../frontend/dist")));

// Catch-all route for React frontend (AFTER API ROUTES)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

//////////////////////////////////////////////// Error Middlewares ////////////////////////////////////////////////////////

// Not found

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Page not found" });
});

// Error 500

app.use(errorHandlerMiddleware);

export default app;
