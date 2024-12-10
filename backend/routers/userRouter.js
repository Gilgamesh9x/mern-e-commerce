import { Router } from "express";
import {
  getUserProfile,
  updateProfile,
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";
import {
  validateUpdateProfile,
  validateIdParam,
} from "../middleware/validationMiddlewarejs.js";
import {
  authorizePermissions,
  authenticateUser,
} from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const userRouter = Router();

userRouter.get("/user-profile", getUserProfile);
userRouter.put("/update-profile", validateUpdateProfile, updateProfile);
userRouter.get("/", authenticateUser, authorizePermissions("admin"), getUsers);
userRouter.get(
  "/:userId",
  validateIdParam(User, "userId"),
  authenticateUser,
  authorizePermissions("admin"),
  getUserById
);
userRouter.delete(
  "/:userId",
  authenticateUser,
  authorizePermissions("admin"),
  deleteUser
);

export default userRouter;
