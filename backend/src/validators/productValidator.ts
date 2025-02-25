import { z } from "zod";

export const ProductFileValidator = z.object({

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
