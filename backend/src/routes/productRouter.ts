import express from "express";
import upload from "../middleware/multerConfig";
import { createProduct } from "../controller/productController";

const router = express.Router();

router.post("/create",upload,  createProduct);

export default router;
