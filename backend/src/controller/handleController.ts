import { NextFunction, Request, Response } from "express";
import { Model, Document } from "mongoose";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { Product } from "../models/productModel";
import { APIFeature } from "../utils/apiFeatures";
import { AppError } from "../utils/ErrorHandling/appError";
import { MESSAGES } from "../utils/constant";

export const getAll = <T extends Document>(
  model: Model<T>,
  popOption?: Record<string, any>
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const feature = new APIFeature(model.find(), req.query)
      .sort()
      .limitFields()
      .pagination();
    let query = feature.query;
    if (popOption) {
      popOption.forEach((option: Record<string, any>) => {
        query = query.populate(option);
      });
    }
    const doc = await query;

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
      throw new AppError(MESSAGES.ID_NOT_FOUND, 404);
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
      throw new AppError(MESSAGES.ID_NOT_FOUND, 404);
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
      throw new AppError(MESSAGES.ID_NOT_FOUND, 404);
    }
    return res.status(200).json({
      status: "success",
      updatedData,
    });
  });
