import express from "express";
import { createCategory } from "../controller/categoryController";
import { isAuthenticated, restrictTo } from "../middleware/authMiddleware";
import Category from "../models/categoryModel";
import {
  deleteById,
  getAll,
  getByID,
  updateById,
} from "../controller/handleController";

const router = express.Router();

router.post("/create", isAuthenticated, restrictTo(["admin"]), createCategory);

router.get("", getAll(Category));
router
  .route("/:id")
  .all(isAuthenticated, restrictTo(["admin"]))
  .get(getByID(Category))
  .delete(deleteById(Category))
  .patch(updateById(Category));

export default router;
