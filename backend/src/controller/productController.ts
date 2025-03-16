import { Request, Response, NextFunction } from "express";
import { Product } from "../models/productModel";
import { AppError } from "../utils/ErrorHandling/appError";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { removeFile } from "../utils/fileUtils";
import upload from "../middleware/multerConfig";
import { getAll } from "./handleController";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files["mainImage"]) {
      files["images"]?.map(async (image) => await removeFile(image.path));
      return next(new AppError("Product profile missing", 400));
    }

    const mainImage = files["mainImage"][0]["path"];
    const images = files["images"]?.map((image) => image.path);
    const product = await Product.create({
      ...req.body,
      mainImage,
      images,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  }
);

