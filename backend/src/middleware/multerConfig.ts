import multer, { StorageEngine, FileFilterCallback } from "multer";
import { Request } from "express";
import path, { parse } from "path";
import fs from "fs";
import { ProductDataValidator } from "../validators/productValidator";
import { AppError, multiError } from "../utils/ErrorHandling/appError";
import crypto from "crypto";
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
    crypto.randomBytes(12, function (err, bytes) {
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  console.log(
    "Printing the file type:",
    allowedMimeTypes.includes(file.mimetype)
  );

  if (!allowedMimeTypes.includes(file.mimetype)) {
    console.log("jaskjfasjf")
   cb(new AppError("Only JPG, PNG  files are allowed!", 400));
  }

  const parsedData = ProductDataValidator.safeParse(req.body);

  if (!parsedData.success) {
     cb(multiError(parsedData.error));
  }else{
  cb(null, true);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

export default upload;
