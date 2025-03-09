import { z } from "zod";

export const ReviewValidator = z.object({
  rating: z.number().refine((val) => val >= 0 && val <= 5, {
    message: "Rating must be inbetween 0 and 5",
  }),
  comment: z.string(),
  productID: z.string(),
});
