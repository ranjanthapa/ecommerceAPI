import express from "express";
import * as userController from "../controller/userController";  

const router = express.Router();

router.get('/', userController.getMessage); 

export default router;
