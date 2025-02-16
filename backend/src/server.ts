import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";

dotenv.config();

connectDB();

app.listen(5000, () => {
  console.log(`Server running on http://localhost:${5000}`);
});
