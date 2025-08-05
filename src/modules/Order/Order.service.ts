import { v4 as uuidv4} from 'uuid'
import CustomResponse from '@/types/custom/CustomResponse'
import { IOrderInput } from '@/types/interface/Order.type'
import { Order } from './Order.model'
import { Cart } from '../Cart/Cart.model';
import { CartStatus } from '@/types/interface/Cart.type';
interface IShortOrderResponse {
  id: string,
  date: Date,
  quantity: number,
  total: number,
  status: CartStatus,
}
export default class OrderService {
  public static async checkout(input: Partial<IOrderInput>): Promise<CustomResponse> {
    try {
      console.log('input username',input.username)
      const result = await Order.create({
        _id: uuidv4(),
        ...input
      });
      if(input.username !== undefined) {
        const cart = await Cart.findOne({ username: input.username, status: CartStatus.PENDING });
        if(cart) {
          cart.items = [];
          cart.total = 0;
          await cart.save();
        }
      } 

      return {
        httpCode: 201,
        success: true,
        message: "ORDER.CHECKOUT.SUCCESS",
        data: result
      } 
    }
    catch(error) {
      return {
        httpCode: 409,
        success: false,
        message: "ORDER.CHECKOUT.CONFLICT",
        error
      }
    }
  }

  public static async getAllOrdersByUsername(username: string, page = 1,
    limit = 10): Promise<CustomResponse> {
    try {
      const skip = (page - 1) * limit;
      const orders = await Order.find({ username })
      .sort({ createdAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit);;
      const totalItems = await Order.countDocuments({ username })
      const response: IShortOrderResponse[] = orders.map((order) => ({
        id: order.id, 
        total: order.total,
        date: order.updatedAt || new Date(),
        status: order.status,
        quantity: order.items.reduce((sum, item) => sum + item.quantity, 0)
      }));
      return {
        httpCode: 200,
        success: true,
        message: "ORDER.GET.SUCCESS",
        data: response,
        pagination: {
          limit,
          page,
          totalPage: Math.ceil(totalItems / limit),
          totalItems,
        },
      } 
    } 
    catch(error) {
      return {
        httpCode: 409,
        success: false,
        message: "ORDER.CHECKOUT.CONFLICT",
        error
      }
    } 
  }
  public static async getAllOrders(page = 1,
    limit = 10) {
      try {
        const skip = (page - 1) * limit;
        const orders = await Order.find()
        .sort({ createdAt: -1, updatedAt: -1 })
          .skip(skip)
          .limit(limit);;
        const totalItems = await Order.countDocuments()
        return {
          httpCode: 200,
          success: true,
          message: "ORDER.GET.SUCCESS",
          data: orders,
          pagination: {
            limit,
            page,
            totalPage: Math.ceil(totalItems / limit),
            totalItems,
          },
        } 
      } 
      catch(error) {
        return {
          httpCode: 409,
          success: false,
          message: "ORDER.CHECKOUT.CONFLICT",
          error
        }
      } 
  }
}