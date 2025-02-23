import express from "express";
import { createCategory } from "../controller/categoryController";


const router = express.Router();


router.post('/create', createCategory);


export default router;