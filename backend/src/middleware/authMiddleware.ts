import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { AppError } from "../utils/ErrorHandling/appError";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { MESSAGES } from "../utils/constant";
import { Types } from "mongoose";

export interface AuthenticateRequest extends Request {
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export const restrictTo = (roles: string[]) => {
  return (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(MESSAGES.UNAUTHORIZED_ACCESS, 401));
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
      return next(new AppError(MESSAGES.UNAUTHENTICATED, 401));
    }
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError(MESSAGES.USER_NOT_FOUND, 401));
    }
    if (user.changePasswordAfter(decoded.iat!)) {
      return next(new AppError(MESSAGES.PASSWORD_CHANGED, 401));
    }
    const data = {
      id: user._id as string,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    req.user = data;
    console.log("print from isAUth section", req.user);
    next();
  }
);

// export const isAuthorizeUser = catchAsync(
//   async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    
//   }
// );
