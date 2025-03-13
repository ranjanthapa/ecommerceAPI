import express from "express";
import upload from "../middleware/multerConfig";
import { createProduct } from "../controller/productController";
import { deleteById, getAll, getByID } from "../controller/handleController";
import { Product } from "../models/productModel";
import { isAuthenticated, restrictTo } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/all", getAll(Product));

router.route("/:id").get(getByID(Product)).delete(deleteById(Product));
router.post("/create", isAuthenticated, restrictTo(['admin']), upload, createProduct);

export default router;
