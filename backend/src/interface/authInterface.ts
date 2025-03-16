import { UserDocI } from "../models/userModel";

export interface AuthenticateRequest extends Request {
    user?: UserDocI; // Use UserDocument from your Mongoose model
  }