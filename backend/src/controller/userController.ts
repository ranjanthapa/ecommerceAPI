import { Request, Response } from "express";

export const getMessage = (req: Request, res: Response)  => {
     res.status(200).json({
        message: "Hellow"
    });
};