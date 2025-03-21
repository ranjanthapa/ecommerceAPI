import { Document, model, Schema } from "mongoose";

export interface CartItemI {
  product: Schema.Types.ObjectId;
  quantity: number;
}

interface CartDocI extends Document {
  user: Schema.Types.ObjectId;
  items: CartItemI[];
}

const CartSchema = new Schema<CartDocI>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

const Cart = model<CartDocI>("Cart", CartSchema);
export default Cart;
