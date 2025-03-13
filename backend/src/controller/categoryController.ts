import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import Category from "../models/categoryModel";
import { getAll } from "./handleController";

export const createCategory = catchAsync(async (req: Request, res:Response, next:NextFunction)=>{
    const category = await Category.create(req.body);
    return res.status(200).json({
        status:"success",
        category
    })
});

export const getData = getAll(Category);