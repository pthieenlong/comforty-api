import { Request, Response } from 'express';
import CartService from './Cart.service';
import CustomRequest from '@/types/custom/CustomRequest';
import jwt from 'jsonwebtoken';
import { configModule } from '@/common/config/config.module';
import { ERole } from '@/types/interface/User.type';
import { ICartItem } from '@/types/interface/Cart.type';
export default class CartController {
  public async getCartByUser(req: Request, res: Response): Promise<any> {
    const username = req.params.username;
    const cart = await CartService.getCartByUser(username as string);
    return res.status(cart.httpCode).json(cart);
  }

  public async getAllCart(req: Request, res: Response): Promise<any> {
    const username = req.params.username;

    const carts = await CartService.getAllCart(username as string);
    return res.status(carts.httpCode).json(carts);
  }
  public async createCart(req: Request, res: Response): Promise<any> {
    const username = req.params.username;

    const carts = await CartService.createCart(username as string);
    return res.status(carts.httpCode).json(carts);
  }
  public async syncCart(req: Request, res: Response): Promise<any> {
    const username = req.params.username;
    const products = req.body.products;

    const result = await CartService.syncCart(username as string, products);
    return res.status(result.httpCode).json(result);
  }

  public async addProduct(req: Request, res: Response): Promise<any> {
    const username = req.params.username;
    const slug = req.body.slug;

    const result = await CartService.addProduct(username as string, slug);

    return res.status(result.httpCode).json(result);
  }
  public async decreaseItem(req: Request, res: Response): Promise<any> {
    const username = req.params.username;
    const { slug } = req.body;
    const results = await CartService.decreaseItem(username, slug);
    return res.status(results.httpCode).json(results);
  }
  public async removeItem(req: Request, res: Response): Promise<any> {
    const username = req.params.username;
    const { slug } = req.body;
    const results = await CartService.removeItem(username, slug);
    return res.status(results.httpCode).json(results);
  }
  public async clearCart(req: Request, res: Response): Promise<any> {
    const username = req.params.username;
    const results = await CartService.clearCart(username);
    return res.status(results.httpCode).json(results);
  }

  public async updateQuantity(req: Request, res: Response): Promise<any> {
    const username = req.params.username;
    const { slug, quantity } = req.body;
    const results = await CartService.updateQuantity(username, slug, quantity);
    return res.status(results.httpCode).json(results);
  }

  public async getCartSummary(req: Request, res: Response): Promise<any> {
    const username = req.params.username;
    const results = await CartService.getCartSummary(username);
    return res.status(results.httpCode).json(results);
  }
}
