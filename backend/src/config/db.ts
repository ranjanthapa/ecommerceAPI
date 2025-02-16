import mongoose from "mongoose";

export default async function connectDB() {

  try {
    await mongoose.connect(process.env.DB_URL!);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(error);
  }
}
