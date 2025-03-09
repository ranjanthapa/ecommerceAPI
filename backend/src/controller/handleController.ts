import { NextFunction, Request, Response } from "express";
import { Model, Document } from "mongoose";
import catchAsync from "../utils/ErrorHandling/catchAsync";

export const getAll = <T extends Document>(model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await model.find();
    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  });

export const deleteById = <T extends Document>(model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await model.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid id or not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Delete successfully",
    });
  });

export const getByID = <T extends Document>(model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await model.findById(req.params.id);
    if (!data) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid id or not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data,
    });
  });
