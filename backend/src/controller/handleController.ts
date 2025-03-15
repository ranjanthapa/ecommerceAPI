import { NextFunction, Request, Response } from "express";
import { Model, Document } from "mongoose";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { Product } from "../models/productModel";
import { APIFeature } from "../utils/apiFeatures";

export const getAll = <T extends Document>(model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const feature = new APIFeature(model.find(), req.query)
      .sort()
      .limitFields()
      .pagination();
    const doc = await feature.query.populate({
      path: "category",
      select: "-__v",
    });

    res.status(200).json({
      status: "success",
      results: doc.length,
      doc,
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

export const updateById = <T extends Document>(model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedData = await model.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedData) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid id or not found",
      });
    }
    return res.status(200).json({
      status: "success",
      updatedData,
    });
  });
