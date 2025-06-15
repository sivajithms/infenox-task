import { Request, Response } from 'express';
import Product from './products.model';
import { SortOrder } from 'mongoose';

export const getAllProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 3, sort } = req.query;
  const sortObj: { [key: string]: SortOrder } = {};

  if (sort === 'price_asc') sortObj.price = 1;
  else if (sort === 'price_desc') sortObj.price = -1;
  else if (sort === 'name') sortObj.name = 1;

  const products = await Product.find()
    .sort(sortObj)
    .skip((+page - 1) * +limit)
    .limit(+limit);

  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

export const addProduct = async (req: Request, res: Response) => {
  const { name, price, images } = req.body;
  try {
    const newProduct = new Product({ name, price, images });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add product', details: error });
  }
};