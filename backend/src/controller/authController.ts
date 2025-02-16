import catchAsync from "../utils/ErrorHandling/catchAsync";
import User from '../models/userModel';
import { LoginSchema } from "../validators/authValidator";
import { AppError } from "../utils/ErrorHandling/appError";
import jwt, { Secret } from "jsonwebtoken";


const signToken = (id: string) => {
    return jwt.sign({ id}, process.env.JWT_SECRET! as Secret, {          
      expiresIn: String(process.env.JWT_EXPIRES_IN)
    });
  };
  


const isEmpty = (str: string): boolean =>{
     return str.length === 0 ? true : false;
}

export const login = catchAsync(async (req, res, next) => {
    const parseData = LoginSchema.safeParse(req.body);
    if (!parseData.success || isEmpty(parseData.data.password)){
        return next(new AppError("email and password required", 400))
    }
    const {email, password} = parseData.data;
    const user = await User.findOne({email}).select("+password");
    if (!user || !(await user.isCorrectPassword(password)) ){
        return next(new AppError("Invalid email or password", 400));
    }
});
