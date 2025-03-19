import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { Product } from "../models/productModel";
import { AppError } from "../utils/ErrorHandling/appError";
import Cart from "../models/cartModel";

export const createCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productID, quantity } = req.body;
    const userID = req.user?.id;
    const productExists = await Product.findById(productID);
    if (!productExists) {
      throw new AppError("Product not found", 404);
    }

    let cart = await Cart.findOne({ user: userID });
    if (!cart) {
      cart = new Cart({
        user: userID,
        items: [{ product: productID, quantity }],
      });
    } else {
      const productIdx = cart.items.findIndex(
        (item) => item.product.toString() === productID
      );
      if (productIdx > -1) {
        cart.items[productIdx].quantity += quantity;
      } else {
        cart.items.push({
          product: req.body.productID,
          quantity,
        });
      }
    }
    await cart.save();
    res.status(200).json({
      status: "success",
      message: "Product added to cart",
      cart,
    });
  }
);
export const fetchCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user?.id;

    if (!user) {
      return res.status(200).json({
        status: "success",
        cart: [],
      });
    }

    const cart = await Cart.aggregate([
      {
        $match: { user: user }, 
      },
      {
        $unwind: "$items"
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetail"
        }
      },  

      {
        $unwind: "$productDetail"
      },
      {
        $project: {
          _id: 1, 
          product: {
            id: "$productDetail._id",
            price: "$productDetail.price",
            mainImage: "$productDetail.mainImage",
            quantity: "$items.quantity",
          },
        },
      },

      {
        $group: {
          _id: "$_id",
          cartItems: { $push: "$product" }

        }
      }
    ]);

    res.status(200).json({
      status: "success",
       cart
    });
  }
);
