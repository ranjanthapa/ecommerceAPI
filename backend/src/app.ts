import express from "express";
import authRouter from "./routes/authRouter";
import categoryRouter from "./routes/categoryRouter";
import {productRouter, reviewRouter} from "./routes/productRouter";
import userRouter from "./routes/userRouter";
import GlobalErrorHandler from "./controller/errorController";
import path from "path";
const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
// app.use("/api/review", reviewRouter);
app.use("/api/product", productRouter, reviewRouter);

app.use(GlobalErrorHandler);

export default app;
