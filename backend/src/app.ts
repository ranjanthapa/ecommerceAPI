import express from "express";
import  authRouter from "./routes/authRouter";
import GlobalErrorHandler from "./controller/errorController";
const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);

app.use(GlobalErrorHandler);

export default app;
