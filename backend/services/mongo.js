import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.on("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

export default async function mongoConnect() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to the database successfully");
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
  console.log("Disconnected from the database successfully");
}
