import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { AppError } from "../utils/ErrorHandling/appError";
import jwt from "jsonwebtoken";
import { promisify } from "util";

interface AuthenticateRequest extends Request {
  user?: {
    role: string;
  };
}

export const restrictToAdmin = () => {
  return (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    if (!req.user && req.user!.role !== "admin") {
      res.status(401).json({
        status: "Fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

export const isAuthenticated = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log("Printing the secret key from env",process.env.JWT_SECRET! )
  console.log(req.headers.authorization)

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
  }
  
  if (!token){
    return next(new AppError("Login required, please login", 401))
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  console.log("test jwt", decoded);
  next();

})