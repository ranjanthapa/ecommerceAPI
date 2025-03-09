import express from "express";
import { createReview } from "../controller/reviewController";
import { validateMongoID } from "../middleware/productMiddlware";


const router = express.Router();

router.post('/create',validateMongoID, createReview);

export default router;