import { NextFunction, Request, Response } from "express";
import ValidationError from "mongoose";
import { AppError, multiError } from "../utils/ErrorHandling/appError";

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



const handleLimitExceed = (err: any) => {
  return new AppError("File selection exceed, select less or equal to  4 file", 400)
}
const GlobalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  if (process.env.NODE_ENV === "development") {
    console.log(err)
    sendDevError(err, res);
  } else if (process.env.NODE_ENV?.trim() === "production") {
    let error = { ...err };
    
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    // if (err.name === "MulterError" && err.code === "LIMIT_UNEXPECTED_FILE") error = handleLimitExceed(error);
    // if (err.)
    sendProductionError(error, res);
  }
};

export default GlobalErrorHandler;
