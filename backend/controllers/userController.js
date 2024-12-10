import "express-async-errors";
import User from "../models/userModel.js";

export async function getUserProfile(req, res) {
  const { userId } = req.user;
  const user = await User.findById(userId, { password: 0 });
  return res.status(200).json({ user });
}

export async function updateProfile(req, res) {
  const { fullName, email } = req.body;

  const updatedProfile = await User.findByIdAndUpdate(
    req.user.userId,
    {
      fullName,
      email,
    },
    { new: true }
  );
  return res.status(200).json({ fullName, email });
}

export async function getUsers(req, res) {
  const users = await User.find({}).select("fullName role email");

  return res.status(200).json(users);
}

export async function getUserById(req, res) {
  const { userId } = req.params;
  const user = await User.findById(userId).select("-password");

  return res.status(200).json({ user });
}

export async function deleteUser(req, res) {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId);

  return res.status(200).json({ message: "User deleted successfully" });
}
