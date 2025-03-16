import { Document, Schema, model } from "mongoose";

interface ReviewI extends Document {
  user: Schema.Types.ObjectId;
  rating: number;
  comment: string;
  product: Schema.Types.ObjectId;
}

const ReviewSchema = new Schema<ReviewI>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true }, 
  },
  { timestamps: true }
);

export const Review = model<ReviewI>("Review", ReviewSchema);
