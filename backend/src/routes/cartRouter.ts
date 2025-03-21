import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/authMiddleware";
import {
  createCart,
  fetchCart,
  updateCartItem,
} from "../controller/cartController";
import { validateMongoID } from "../middleware/productMiddlware";
import { deleteById } from "../controller/handleController";
import Cart from "../models/cartModel";

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
router.patch("/update", isAuthenticated, restrictTo(["user"]), updateCartItem);
router.delete("/:id", isAuthenticated, restrictTo(["user"]), deleteById(Cart));

export default router;
