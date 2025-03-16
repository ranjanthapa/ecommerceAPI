import { NextFunction, Request, Response } from "express";
import ValidationError from "mongoose";
import { AppError } from "../utils/ErrorHandling/appError";
import { MulterError } from "multer";
import { MESSAGES } from "../utils/constant";

const sendDevError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

const sendProductionError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: err.status,
      message: "Something went wrong",
    });
  }
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  return new AppError(errors.join(", "), 400);
};

const handleLimitExceed = (err: MulterError) => {
  if (err.field === "mainImage") {
    return new AppError(
      `File selection for ${err.field} exceed, select only one image for product profile`,
      400
    );
  } else {
    return new AppError(
      `File selection for ${err.field} exceed, select only maximum of 4 image`,
      400
    );
  }
};

const handleCastError = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 401);
};

const handleJsonWebTokenError = () =>
  new AppError(MESSAGES.TOKEN_INVALID, 401);

const handleTokenExpiredError = () =>
  new AppError(MESSAGES.TOKEN_EXPIRED, 401);

const GlobalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV?.trim() === "production") {
    let error = { ...err };
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err instanceof MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
      error = handleLimitExceed(err);
    }
    if (err.name === "CastError") error = handleCastError(error);
    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError();

    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();
    sendProductionError(error, res);
  }
};

export default GlobalErrorHandler;
