import { v4 as uuidv4 } from 'uuid';
import CustomResponse from '@/types/custom/CustomResponse';
import { IOrderInput } from '@/types/interface/Order.type';
import { Order } from './Order.model';
import { Cart } from '../Cart/Cart.model';
import { CartStatus } from '@/types/interface/Cart.type';
interface IShortOrderResponse {
  id: string;
  date: Date;
  quantity: number;
  total: number;
  status: CartStatus;
}
export default class OrderService {
  public static async checkout(
    input: Partial<IOrderInput>,
  ): Promise<CustomResponse> {
    try {
      console.log('input username', input.username);
      const result = await Order.create({
        _id: uuidv4(),
        ...input,
      });
      if (input.username !== undefined) {
        const cart = await Cart.findOne({
          username: input.username,
          status: CartStatus.PENDING,
        });
        if (cart) {
          cart.items = [];
          cart.total = 0;
          await cart.save();
        }
      }

      return {
        httpCode: 201,
        success: true,
        message: 'ORDER.CHECKOUT.SUCCESS',
        data: result,
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'ORDER.CHECKOUT.CONFLICT',
        error,
      };
    }
  }

  public static async getAllOrdersByUsername(
    username: string,
    page = 1,
    limit = 10,
  ): Promise<CustomResponse> {
    try {
      const skip = (page - 1) * limit;
      const orders = await Order.find({ username })
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalItems = await Order.countDocuments({ username });
      const response: IShortOrderResponse[] = orders.map((order) => ({
        id: order.id,
        total: order.total,
        date: order.updatedAt || new Date(),
        status: order.status,
        quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      }));
      return {
        httpCode: 200,
        success: true,
        message: 'ORDER.GET.SUCCESS',
        data: response,
        pagination: {
          limit,
          page,
          totalPage: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'ORDER.GET.FAIL',
        error,
      };
    }
  }
  public static async getAllOrders(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const orders = await Order.find()
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalItems = await Order.countDocuments();
      return {
        httpCode: 200,
        success: true,
        message: 'ORDER.GET.SUCCESS',
        data: orders,
        pagination: {
          limit,
          page,
          totalPage: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'ORDER.GET.FAIL',
        error,
      };
    }
  }
  public static async getOrderDetails(
    id: string,
    username: string,
  ): Promise<CustomResponse> {
    try {
      const order = await Order.findOne({ _id: id, username });
      if (!order) {
        return {
          httpCode: 404,
          success: false,
          message: 'ORDER.NOT_FOUND',
        };
      }
      return {
        httpCode: 200,
        success: true,
        message: 'ORDER.GET.SUCCESS',
        data: order,
      };
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'ORDER.GET.FAIL',
        error,
      };
    }
  }

  public static async updateOrderStatus(
    orderId: string,
    status: CartStatus,
    username?: string,
  ): Promise<CustomResponse> {
    try {
      const query: any = { _id: orderId };
      if (username) {
        query.username = username;
      }

      const order = await Order.findOne(query);
      if (!order) {
        return {
          httpCode: 404,
          success: false,
          message: 'ORDER.NOT_FOUND',
        };
      }

      order.status = status;
      order.updatedAt = new Date();
      await order.save();

      return {
        httpCode: 200,
        success: true,
        message: 'ORDER.UPDATE.SUCCESS',
        data: order,
      };
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'ORDER.UPDATE.FAIL',
        error,
      };
    }
  }

  public static async getOrderStatistics(
    username?: string,
  ): Promise<CustomResponse> {
    try {
      const query: any = {};
      if (username) {
        query.username = username;
      }

      const totalOrders = await Order.countDocuments(query);
      const pendingOrders = await Order.countDocuments({
        ...query,
        status: CartStatus.PENDING,
      });
      const shippingOrders = await Order.countDocuments({
        ...query,
        status: CartStatus.SHIPPING,
      });
      const completedOrders = await Order.countDocuments({
        ...query,
        status: CartStatus.COMPLETED,
      });

      // Tính tổng doanh thu
      const revenueResult = await Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            averageOrderValue: { $avg: '$total' },
          },
        },
      ]);

      const totalRevenue = revenueResult[0]?.totalRevenue || 0;
      const averageOrderValue = revenueResult[0]?.averageOrderValue || 0;

      // Thống kê theo tháng (6 tháng gần nhất)
      const monthlyStats = await Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            orderCount: { $sum: 1 },
            revenue: { $sum: '$total' },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
      ]);
      const result = {
        overview: {
          totalOrders,
          pendingOrders,
          shippingOrders,
          completedOrders,
          totalRevenue,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        },
        monthlyStats: monthlyStats.reverse(),
      };
      return {
        httpCode: 200,
        success: true,
        message: 'ORDER.STATISTICS.SUCCESS',
        data: result,
      };
    } catch (error) {
      console.error('Get order statistics error:', error);
      return {
        httpCode: 500,
        success: false,
        message: 'ORDER.STATISTICS.FAIL',
        error,
      };
    }
  }
  public static async getOrderDetailsByID(id: string): Promise<CustomResponse> {
    try {
      const order = await Order.findOne({ _id: id });
      if (!order) {
        return {
          httpCode: 404,
          success: false,
          message: 'ORDER.NOT_FOUND',
        };
      }
      return {
        httpCode: 200,
        success: true,
        message: 'ORDER.GET.SUCCESS',
        data: order,
      };
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'ORDER.GET.FAIL',
        error,
      };
    }
  }
}
