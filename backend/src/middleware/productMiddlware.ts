import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/ErrorHandling/appError";
import mongoose from "mongoose";

export const productFileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files["mainImage"]) {
    return next(new AppError("Product profile image is required", 400));
  }
  next();
};

export const validateMongoID = (field: "body" | "params" | "query", key: string) =>(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req[field]?.[key];
  if (!mongoose.isValidObjectId(id)) {
    res.status(403).json({
      status: "Failed",
      message: "Invalid object id",
    });
  }
  console.log("Validation complete for id");
  next();
};
