import { z } from "zod";

export const ReviewValidator = z.object({
  rating: z.number().refine((val) => val >= 0 && val <= 5, {
    message: "Rating must be inbetween 0 and 5",
  }),
  comment: z
    .string({ required_error: "Comment can't be empty" })
    .min(4, "Comment required with a minimum of 4 characters"),
});
