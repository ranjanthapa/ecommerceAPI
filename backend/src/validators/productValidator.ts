import { z } from "zod";

export const ProductValidator = z.object({
  mainImage: z.string(),
  image1: z.string().url().optional(),
  image2: z.string().url().optional(),
  image3: z.string().url().optional(),
  image4: z.string().url().optional(),
  productName: z.string().min(1, { message: "Product name is required" }),
  price: z.string().transform((val) => parseInt(val)),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  size: z.string().optional(),
  discountPercentage: z
    .string()
    .min(0, { message: "Discount should be between 0 and 100" })
    .max(100, { message: "Discount should be between 0 and 100" })
    .transform((val) => parseInt(val)),
  category: z
    .array(z.string())
    .nonempty({ message: "At least one category is required" }),
});

export const ProductDataValidator = z.object({
  productName: z.string({ message: "Product name is required" }),
  price: z.coerce
    .number({ message: "Price required" })
    .gt(0, { message: "Price must be greater then 0" }),
  description: z
    .string({ message: "Description required" })
    .min(10, { message: "Description must be at least 10 characters long" }),
  size: z.string().optional(),
  discountPercentage: z.coerce
    .number()
    .min(0, { message: "Discount must be at least 0" })
    .max(100, { message: "Discount can't exceed 100" })
    .default(0)
    .optional(),
  category: z
    .array(z.string())
    .nonempty({ message: "At least one category is required" }),
});
