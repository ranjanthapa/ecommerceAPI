import { NextFunction, Request, Response } from "express";
import { ProductDataValidator } from "../validators/productValidator";
import { AppError, multiError } from "../utils/ErrorHandling/appError";

export const productFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log("Calling from middleware.......")
    console.log(req.files);
    if (!files["mainImage"]) {
        return next(new AppError("Product profile image is required", 400));
    }
    next();
};
