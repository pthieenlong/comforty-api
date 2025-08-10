import { Request, Response } from 'express';
import OrderService from './Order.service';
import { ICartItem } from '@/types/interface/Cart.type';
export default class OrderController {
  public async getAllOrders(req: Request, res: Response): Promise<any> {
    const { page } = req.query;
    const result = await OrderService.getAllOrders(
      parseInt((page as string) ?? 1),
    );

    return res.status(result.httpCode).json(result);
  }

  public async getAllOrdersByUsername(
    req: Request,
    res: Response,
  ): Promise<any> {
    const { page } = req.query;
    const { username } = req.params;

    const result = await OrderService.getAllOrdersByUsername(
      username,
      parseInt((page as string) ?? 1),
    );

    return res.status(result.httpCode).json(result);
  }

  public async checkout(req: Request, res: Response): Promise<any> {
    const input: {
      firstName: string;
      lastName: string;
      address: string;
      phone: string;
      email: string;
      items: ICartItem[];
      total: number;
      username?: string;
    } = req.body;
    console.log(`username: ${input.username}`);
    const result = await OrderService.checkout(input);
    return res.status(result.httpCode).json(result);
  }

  public async getOrderDetails(req: Request, res: Response): Promise<any> {
    const id = req.query.id as string;
    const { username } = req.params;
    const result = await OrderService.getOrderDetails(id, username);

    return res.status(result.httpCode).json(result);
  }
}
