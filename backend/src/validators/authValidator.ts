import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid Email format" }),
  password: z.string(),
});

export const SignUpSchema = z.object({
  fullName: z.string().min(8, "Full name needs to be min of 8 char"),
  email: z.string().email({ message: "Invalid Email format" }),
  contactNumber: z
    .string()
    .min(10, { message: "Number must be atleast 10 digit" })
    .refine((val) => /^\d+$/.test(val), {
      message: "Contact number should contain only numbers",
    }),
  role: z.enum(["user", "admin"]).default("user"),
  password: z.string(),
});
