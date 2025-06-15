import express from 'express';
import { addToCart, getCartCount } from './cart.service';

export const cartRouter = express.Router();

cartRouter.post('/add', addToCart);
cartRouter.get('/count', getCartCount);