import express from "express";
import * as userController from "../controller/userController";  
import { deleteById, getAll, getByID } from "../controller/handleController";
import {User} from "../models/userModel";

const router = express.Router();

router.get('/', getAll(User)); 
router.route("/:id").get(getByID(User)).delete(deleteById(User));


export default router;
