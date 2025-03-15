import catchAsync from "../utils/ErrorHandling/catchAsync";
import { User } from "../models/userModel";
import { LoginSchema, SignUpSchema } from "../validators/authValidator";
import { AppError } from "../utils/ErrorHandling/appError";
import jwt, { Secret } from "jsonwebtoken";
import { ObjectId, Document } from "mongoose";
import { Response } from "express";

const signToken = (id: ObjectId) => {
  const JWT_SECRET = process.env.JWT_SECRET?.trim() as string;

  return jwt.sign({ id: id }, JWT_SECRET, {
    expiresIn: "1d",
  },);
};

const createSendToken = (user: Document, res: Response, statusCode: number) => {
  const token = signToken(user._id as ObjectId);

  return res.status(statusCode).json({
    token,
    user,
  });
};

const isEmpty = (str: string): boolean => {
  return str.length == 0 ? true : false;
};

export const login = catchAsync(async (req, res, next) => {
  const parseData = LoginSchema.safeParse(req.body);

  if (!parseData.success || isEmpty(parseData.data.password)) {
    return next(new AppError("Invalid data passed", 400));
  }

  const { email, password } = parseData.data;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 400));
  }
  createSendToken(user, res, 200);
});

export const signUp = catchAsync(async (req, res, next) => {
  const parseData = SignUpSchema.safeParse(req.body);
  if (!parseData.success) {
    const errors = parseData.error.errors.map((error) => error.message);
    return next(new AppError(errors.join(", "), 400));
  }
  const user = await User.create(parseData.data);
  createSendToken(user, res, 201);
});
