import mongoose, { Document, Model } from "mongoose";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";

export const getAllData = (model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await model.find(); 
    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  });
