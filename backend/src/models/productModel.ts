import { Schema, model, Document } from "mongoose";
import validator from "validator";

interface ProductDocI extends Document {
  mainImage: string;
  images?: string[];

  productName: string;
  price: number;
  description: string;
  size?: string;
  discountPercentage: number;
  category: Schema.Types.ObjectId[];
}

const ProductSchema = new Schema<ProductDocI>(
  {
    mainImage: {
      type: String,
      required: [true, "Main image of product required"],
    },
    images: [{ type: String, required: false }],

    productName: { type: String, required: [true, "Product name required"] },
    price: {
      type: Number,
      required: [true, "Price required"],
      validate: {
        validator: function (val) {
          return val > 0;
        },
        message: "Price of product should be greater then 0",
      },
    },
    description: {
      type: String,
      required: [true, "Product description required"],
    },
    size: { type: String, required: false },
    discountPercentage: {
      type: Number,
      required: false,
      validate: {
        validator: function (val) {
          return val > 0;
        },
        message: "Discount percentage of product should be greater then 0",
      },
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product category should be selected"],
      },
    ],
  },
  { timestamps: true }
);

export const Product = model("Product", ProductSchema);
