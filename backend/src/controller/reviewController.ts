import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { ReviewValidator } from "../validators/reviewValidator";
import { AppError, multiError } from "../utils/ErrorHandling/appError";
import mongoose, { Model } from "mongoose";
import { Review } from "../models/reviewModel";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import { MESSAGES } from "../utils/constant";

export const createReview = catchAsync(
  async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    const validateData = ReviewValidator.safeParse(req.body);
    if (!validateData.success) {
      throw multiError(validateData.error);
    }
    const productID = req.params.productID;
    console.log("ProductID", productID);
    const data = {
      ...req.body,
      product: productID,
      user: req.user?.id,
    };
    console.log("Printing the data", data);
    const review = await Review.create(data);
    return res.status(201).json({
      status: "success",
      message: "Review submitted",
      review,
    });
  }
);

export const updateReviewByID = catchAsync(
  async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
      throw new AppError("Invalid id or not found", 400);
    }

    if (req.user?.id.toString() !== review.user.toString()) {
      throw new AppError(MESSAGES.UNAUTHORIZED_ACCESS, 403);
    }

    const updatedData = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedData) {
      throw new AppError(MESSAGES.ID_NOT_FOUND, 400);
    }
    return res.status(200).json({
      status: "success",
      updatedData,
    });
  }
);


export const deleteReviewByID = catchAsync(
  async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
      throw new AppError("Invalid id or not found", 400);
    }

    if (req.user?.id.toString() !== review.user.toString()) {
      throw new AppError(MESSAGES.UNAUTHORIZED_ACCESS, 403);
    }

    const isDelete = await Review.findByIdAndDelete(req.params.id)
    if (!isDelete) {
      throw new AppError(MESSAGES.ID_NOT_FOUND, 400);
    }
    return res.status(200).json({
      status: "success",
      message: "Delete Successfully"
    });
  }
);
