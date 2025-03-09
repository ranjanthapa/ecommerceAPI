import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { ReviewValidator } from "../validators/reviewValidator";

export const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validateData = ReviewValidator.safeParse(req.body);
    console.log(validateData)
})