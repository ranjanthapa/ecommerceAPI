import {z} from 'zod';


export const LoginSchema = z.object({
    email: z.string().email({message: "Invalid Email format"}),
    password: z.string()
});