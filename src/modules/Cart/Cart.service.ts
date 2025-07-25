import CustomResponse from '@/types/custom/CustomResponse';
import { v4 as uuidv4 } from 'uuid';
import { CartStatus } from '@/types/interface/Cart.type';
import type ICart from './Cart.model';
import Utils from '@/utils/utils';
import { Cart } from './Cart.model';
import { Product } from '../Product/Product.model';
export default class CartService {
  public static async getCartByUser(username: string): Promise<CustomResponse> {
    try {
      const carts = await Cart.findOne({
        username,
        status: CartStatus.PENDING,
      });
      if (!carts) {
        return {
          httpCode: 200,
          success: true,
          message: 'CART.GET.SUCESS',
          data: [],
        };
      }
      return {
        httpCode: 200,
        success: true,
        message: 'CART.GET.SUCESS',
        data: [carts],
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    }
  }
  public static async getAllCart(username: string): Promise<CustomResponse> {
    try {
      const carts = await Cart.find({ username });
      return {
        httpCode: 200,
        success: true,
        message: 'CART.GET.SUCESS',
        data: carts,
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    }
  }
  public static async createCart(username: string): Promise<CustomResponse> {
    try {
      const cart = await Cart.findOne({ username, status: CartStatus.PENDING });
      if (cart) {
        return {
          httpCode: 200,
          success: true,
          message: 'CART.GET.SUCESS',
          data: cart,
        };
      } else {
        const result = await Cart.create({
          _id: uuidv4(),
          username,
        });
        return {
          httpCode: 201,
          success: true,
          message: 'CART.CREATE.SUCCESS',
          data: result,
        };
      }
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.CREATE.FAIL',
      };
    }
  }

  public static async addProduct(
    username: string,
    slug: string,
  ): Promise<CustomResponse> {
    try {
      const cart = await Cart.findOne({ username, status: CartStatus.PENDING });
      if (!cart) {
        return {
          httpCode: 404,
          success: false,
          message: 'CART.ADD.NOT_FOUND',
        };
      }

      const product = await Product.findOne({ slug });
      if (!product) {
        return {
          httpCode: 404,
          success: false,
          message: 'PRODUCT.GET.NOT_FOUND',
        };
      }
      const items = cart.products;
      const itemInCart = items.find((val) => val.slug === product.slug);
      if (itemInCart) {
        itemInCart.quantity += 1;
        itemInCart.price += product.price;

        cart.products[
          items.findIndex((val) => {
            val.slug == itemInCart.slug;
          })
        ] = itemInCart;

        cart.total += product.price;

        await cart.save();

        return {
          httpCode: 201,
          success: true,
          message: 'CART.UPDATE.SUCCESS',
        };
      }
      cart.products.push({
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        quantity: 1,
        price: product.price,
      });

      cart.total += product.price;

      const result = await cart.save();

      if (!result)
        return {
          httpCode: 409,
          success: false,
          message: 'CART.ADD.CONFLICT',
        };
      return {
        httpCode: 201,
        success: true,
        message: 'CART.ADD.SUCCESS',
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    }
  }

  public static async updateProductQuantity(
    username: string,
    slug: string,
    newQuantity: number,
  ): Promise<CustomResponse> {
    try {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    }
  }

  public static async removeProduct(
    username: string,
    slug: string,
  ): Promise<CustomResponse> {
    try {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    }
  }

  public static async clearCart(username: string): Promise<CustomResponse> {
    try {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    }
  }

  public static async updateStatus(
    username: string,
    status: CartStatus,
  ): Promise<CustomResponse> {
    try {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    }
  }

  public static async checkout(username: string): Promise<CustomResponse> {
    try {
      const cart = await Cart.findOne({
        username,
        status: CartStatus.PENDING,
      });

      if (!cart)
        return {
          httpCode: 404,
          success: false,
          message: 'CART.GET.FAIL',
        };
      else {
        cart.status = CartStatus.PAID;
        const result = await cart.save();

        if (result) {
          return {
            httpCode: 201,
            success: true,
            message: 'CART.CHECKOUT.SUCCESS',
          };
        } else {
          return {
            httpCode: 409,
            success: false,
            message: 'CART.CHECKOUT.CONFLICT',
          };
        }
      }
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'CART.CHECKOUT.CONFLICT',
      };
    }
  }
}
