import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/authMiddleware";
import { createCart, fetchCart } from "../controller/cartController";
import { validateMongoID } from "../middleware/productMiddlware";

const router = express.Router();

router
  .route("/")
  .post(
    isAuthenticated,
    restrictTo(["user"]),
    validateMongoID("body", "productID"),
    createCart
  );

router.get("/fetch", isAuthenticated, fetchCart);

export default router;
