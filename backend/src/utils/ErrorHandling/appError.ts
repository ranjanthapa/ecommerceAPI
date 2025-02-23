import { NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
   statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const multiError = (error: ZodError) => {
  const errors = error.errors.map((err) => err.message);
  return new AppError(errors.join(", "), 400);
};
