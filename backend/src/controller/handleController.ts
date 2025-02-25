import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";

export const getAll = ()=> catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

})