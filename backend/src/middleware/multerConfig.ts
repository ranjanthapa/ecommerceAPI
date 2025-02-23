import multer, { StorageEngine, FileFilterCallback } from "multer";
import { Request } from "express";
import path, { parse } from "path";
import fs from "fs";
import { ProductDataValidator } from "../validators/productValidator";
import { AppError, multiError } from "../utils/ErrorHandling/appError";

const uploadDir = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  file.mimetype = "image";
  console.log(req.body);
  const parsedData = ProductDataValidator.safeParse(req.body);
  console.log("We are calling the req file from file filter", req.files);

  if (!parsedData.success) {
    cb(multiError(parsedData.error));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

export default upload;
