import { Request, Response } from 'express';
import CartService from './Cart.service';
import CustomRequest from '@/types/custom/CustomRequest';
import jwt from 'jsonwebtoken';
import { configModule } from '@/common/config/config.module';
import { ERole } from '@/types/interface/User.type';
export default class CartController {
  public async getCartByUser(req: CustomRequest, res: Response) {
    const userID = req.userID;
    const cart = await CartService.getCartByUser(userID as string);
    return res.status(cart.httpCode).json(cart);
  }

  public async getAllCart(req: CustomRequest, res: Response) {
    const userID = req.userID;

    const carts = await CartService.getAllCart(userID as string);
    return res.status(carts.httpCode).json(carts);
  }
  public async createCart(req: CustomRequest, res: Response) {
    const userID = req.userID;

    const carts = await CartService.createCart(userID as string);
    return res.status(carts.httpCode).json(carts);
  }
  public async addProduct(req: CustomRequest, res: Response) {
    const userID = req.userID;
    const slug = req.body;

    const result = await CartService.addProduct(userID as string, slug);

    return res.status(result.httpCode).json(result);
  }
}
