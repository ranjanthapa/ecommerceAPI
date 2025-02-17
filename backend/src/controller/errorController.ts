import { NextFunction, Request, Response } from "express";
import {AppError} from "../utils/ErrorHandling/appError";

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

const GlobalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.log(typeof(err));
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV?.trim() === "production") {
    sendProductionError(err, res);
  }
};

export default GlobalErrorHandler;
