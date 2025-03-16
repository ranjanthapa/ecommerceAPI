import express from "express";
import { createReview } from "../controller/reviewController";
import { validateMongoID } from "../middleware/productMiddlware";
import { isAuthenticated, restrictTo } from "../middleware/authMiddleware";


const router = express.Router();

router.post('/create', isAuthenticated, restrictTo(['user']), createReview);

export default router;