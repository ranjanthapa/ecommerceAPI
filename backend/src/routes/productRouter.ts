import express from "express";
import upload from "../middleware/multerConfig";
import { createProduct } from "../controller/productController";
import {
  deleteById,
  getAll,
  getByID,
  updateById,
} from "../controller/handleController";
import { Product } from "../models/productModel";
import { isAuthenticated, restrictTo } from "../middleware/authMiddleware";
import { validateMongoID } from "../middleware/productMiddlware";
import {
  createReview,
  deleteReviewByID,
  updateReviewByID,
} from "../controller/reviewController";
import { Review } from "../models/reviewModel";

export const productRouter = express.Router();

export const reviewRouter = express.Router();

productRouter.get("/all", getAll(Product));

productRouter.route("/:id").get(getByID(Product)).delete(deleteById(Product));
productRouter.post(
  "/create",
  isAuthenticated,
  restrictTo(["admin"]),
  upload,
  createProduct
);

reviewRouter
  .route("/:productID/review")
  .get(getAll(Review))
  .post(
    isAuthenticated,
    restrictTo(["user"]),
    validateMongoID("params", "productID"),
    createReview
  );

const popOption = [
  {
    path: "product",
  },
  {
    path: "user",
    select: ["-password"],
  },
];

reviewRouter
  .route("/:productID/review/:id")
  .get(getByID(Review))
  .delete(isAuthenticated, deleteReviewByID)
  .patch(isAuthenticated, updateReviewByID);
