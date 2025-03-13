import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { AppError } from "../utils/ErrorHandling/appError";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { User } from "../models/userModel";
import { AUTH_MESSAGES } from "../utils/constant";

interface AuthenticateRequest extends Request {
  user?: {
    fullName: string;
    email: string;
    contactNumber: string;
    password: string;
    role: string;
  };
}

export const restrictTo = (roles: string[]) => {
  return (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(AUTH_MESSAGES.UNAUTHORIZED_ACCESS, 401)
      );
    }
    next();
  };
};

export const isAuthenticated = catchAsync(
  async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    let token;
    const JWT_SECRET = process.env.JWT_SECRET?.trim() as string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError(AUTH_MESSAGES.UNAUTHENTICATED, 401));
    }
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError(AUTH_MESSAGES.USER_NOT_FOUND, 401));
    }
    if (user.changePasswordAfter(decoded.iat!)) {
      return next(
        new AppError(AUTH_MESSAGES.PASSWORD_CHANGED, 401)
      );
    }
    req.user = user;
    next();
  }
);
