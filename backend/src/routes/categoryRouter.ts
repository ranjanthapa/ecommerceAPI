import express from "express";
import { createCategory, getData } from "../controller/categoryController";
import { isAuthenticated } from "../middleware/authMiddleware";
import Category from "../models/categoryModel";
import { deleteById, getByID } from "../controller/handleController";


const router = express.Router();


router.post('/create', createCategory);

router.get('', getData);
router.route("/:id").get(getByID(Category)).delete(deleteById(Category));


export default router;