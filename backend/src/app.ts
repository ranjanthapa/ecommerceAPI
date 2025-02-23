import express from "express";
import  authRouter from "./routes/authRouter";
import categoryRouter from "./routes/categoryRouter";
import productRouter from "./routes/productRouter";
import GlobalErrorHandler from "./controller/errorController";
import path from "path";
const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)

app.use(GlobalErrorHandler);

export default app;
