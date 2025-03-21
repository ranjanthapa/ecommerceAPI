import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/ErrorHandling/catchAsync";
import { Product } from "../models/productModel";
import { AppError } from "../utils/ErrorHandling/appError";
import Cart, { CartItemI } from "../models/cartModel";
import { Schema } from "mongoose";
import { MESSAGES } from "../utils/constant";

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
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $unwind: "$productDetail",
      },
      {
        $project: {
          _id: 1,
          product: {
            productID: "$productDetail._id",
            itemID: "$items._id",
            price: "$productDetail.price",
            mainImage: "$productDetail.mainImage",
            quantity: "$items.quantity",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          cartItems: { $push: "$product" },
        },
      },
      {
        $project: {
          _id: 0,
          cartID: "$_id",
          cartItems: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      cart,
    });
  }
);

export const updateCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user?.id });

    if (cart) {
      const itemID = req.body.itemID;
      const itemIndex = cart.items.findIndex(
        (item: Record<string, any>) => item._id.toString() === itemID
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      cart.items[itemIndex].quantity = req.body.quantity;

      await cart.save();
      return res
        .status(200)
        .json({ message: "Cart item updated successfully" });
    }

    return res
      .status(404)
      .json({ status: "failed", message: "Cart not found" });
  }
);

export const deleteCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOneAndDelete({
      user: req.user?.id,
      _id: req.params.id,
    });
    if (!cart) {
      throw new AppError(MESSAGES.ID_NOT_FOUND, 400);
    }
    return res.status(204).json({
      status: "Success",
      message: "Delete Sucessfully",
    });
  }
);
