import { Request, Response } from 'express';
import Cart from './cart.model';

export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  let cartItem = await Cart.findOne({ productId });

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    cartItem = new Cart({ productId, quantity });
    await cartItem.save();
  }

  res.json({ success: true });
};

export const getCartCount = async (req: Request, res: Response) => {
  const items = await Cart.find();
  const count = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  res.json({ count });
};