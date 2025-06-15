import express from 'express';
import { addProduct, getAllProducts, getProductById } from './products.service';

export const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', addProduct);

