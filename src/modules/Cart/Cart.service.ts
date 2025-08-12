import CustomResponse from '@/types/custom/CustomResponse';
import { v4 as uuidv4 } from 'uuid';
import { CartStatus, ICartItem } from '@/types/interface/Cart.type';
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

  public static async syncCart(
    username: string,
    products: ICartItem[],
  ): Promise<CustomResponse> {
    try {
      let cart = await Cart.findOne({ username });
      if (!cart) {
        cart = await Cart.create({
          _id: uuidv4(),
          username,
          items: [...products],
          total: products.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0,
          ),
        });
      } else {
        const existingItems = cart.items;
        const newItems = products;

        const existingItemMap = new Map();
        existingItems.forEach((item) => {
          existingItemMap.set(item.slug, item);
        });
        console.log(newItems);

        newItems.forEach((newItem) => {
          const existingItem = existingItemMap.get(newItem.slug);

          if (existingItem) {
            existingItem.quantity = newItem.quantity;
            existingItem.price = newItem.price;
            existingItem.salePercent = newItem.salePercent;
          } else {
            existingItems.push(newItem);
          }
        });

        cart.total = existingItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        await cart.save();
      }
      return {
        httpCode: 200,
        success: true,
        message: 'CART.SYNC.SUCESS',
        data: cart,
      };
    } catch (error) {
      console.error('Sync cart Error: ', error);
      return {
        httpCode: 409,
        success: false,
        message: 'CART.SYNC.FAIL',
      };
    }
  }

  public static async addProduct(
    username: string,
    slug: string,
  ): Promise<CustomResponse> {
    try {
      let cart = await Cart.findOne({ username, status: CartStatus.PENDING });
      if (!cart) {
        cart = await Cart.create({
          _id: uuidv4(),
          username,
        });
      }
      const product = await Product.findOne({ slug });
      if (!product) {
        return {
          httpCode: 404,
          success: false,
          message: 'PRODUCT.GET.NOT_FOUND',
        };
      }
      const items = cart.items;
      const itemInCart = items.find((val) => val.slug === product.slug);
      if (itemInCart) {
        itemInCart.quantity += 1;
        itemInCart.price = product.price * itemInCart.quantity;

        cart.items[items.findIndex((val) => val.slug === itemInCart.slug)] =
          itemInCart;

        cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);

        await cart.save();

        return {
          httpCode: 201,
          success: true,
          message: 'CART.UPDATE.SUCCESS',
        };
      }
      cart.items.push({
        id: product.id,
        slug: product.slug,
        title: product.title,
        image: product.images[0],
        quantity: 1,
        price: product.price,
        isSale: product.isSale,
        salePercent: product.salePercent,
        categories: product.category,
        inStock: true,
      });

      cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);

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
      console.error(error);

      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
        error,
      };
    }
  }

  public static async decreaseItem(
    username: string,
    slug: string,
  ): Promise<CustomResponse> {
    try {
      let cart = await Cart.findOne({ username, status: CartStatus.PENDING });
      if (!cart) {
        return {
          httpCode: 404,
          success: false,
          message: 'CART.GET.NOT_FOUND',
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
      const items = cart.items;
      const itemInCart = items?.find((val) => val.slug === product.slug);
      if (itemInCart) {
        itemInCart.quantity -= 1;
        itemInCart.price -= product.price;
        const itemIndex = items.findIndex(
          (val) => val.slug === itemInCart.slug,
        );
        cart.items[itemIndex] = itemInCart;
        cart.total -= product.price;

        await cart.save();

        return {
          httpCode: 201,
          success: true,
          message: 'CART.UPDATE.SUCCESS',
        };
      }

      return {
        httpCode: 404,
        success: false,
        message: 'CART.UPDATE.FAIL',
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CART.GET.FAIL',
      };
    }
  }

  public static async removeItem(
    username: string,
    slug: string,
  ): Promise<CustomResponse> {
    try {
      const cart = await Cart.findOne({ username, status: CartStatus.PENDING });
      if (!cart) {
        return {
          httpCode: 404,
          success: false,
          message: 'CART.GET.NOT_FOUND',
        };
      }

      const itemToRemove = cart.items.find((item) => item.slug === slug);

      if (!itemToRemove) {
        return {
          httpCode: 404,
          success: false,
          message: 'PRODUCT.GET.NOT_FOUND',
        };
      }

      cart.items = cart.items.filter((item) => item.slug !== slug);
      cart.total -= itemToRemove.price;

      await cart.save();

      return {
        httpCode: 200,
        success: true,
        message: 'CART.REMOVE.SUCCESS',
      };
    } catch (error) {
      console.error('Remove product error:', error);
      return {
        httpCode: 500,
        success: false,
        message: 'CART.REMOVE.FAIL',
        error,
      };
    }
  }

  public static async clearCart(username: string): Promise<CustomResponse> {
    try {
      const cart = await Cart.findOne({ username, status: CartStatus.PENDING });

      if (!cart) {
        return {
          httpCode: 404,
          success: false,
          message: 'CART.GET.FAIL',
        };
      }
      cart.items = [];
      cart.total = 0;

      await cart.save();

      return {
        httpCode: 200,
        success: true,
        message: 'CART.CLEAR.SUCCESS',
      };
    } catch (error) {
      console.error('Clear cart error:', error);
      return {
        httpCode: 500,
        success: false,
        message: 'CART.CLEAR.FAIL',
        error,
      };
    }
  }

  public static async updateQuantity(
    username: string,
    slug: string,
    quantity: number,
  ): Promise<CustomResponse> {
    try {
      const cart = await Cart.findOne({ username, status: CartStatus.PENDING });
      if (!cart) {
        return {
          httpCode: 404,
          success: false,
          message: 'CART.GET.NOT_FOUND',
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

      const itemIndex = cart.items.findIndex((item) => item.slug === slug);
      if (itemIndex === -1) {
        return {
          httpCode: 404,
          success: false,
          message: 'ITEM.NOT_FOUND_IN_CART',
        };
      }

      // Nếu quantity = 0, xóa item khỏi cart
      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        // Cập nhật quantity và price
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price * quantity;
      }

      // Tính lại total
      cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);

      await cart.save();

      return {
        httpCode: 200,
        success: true,
        message: 'CART.UPDATE.SUCCESS',
        data: cart,
      };
    } catch (error) {
      console.error('Update quantity error:', error);
      return {
        httpCode: 500,
        success: false,
        message: 'CART.UPDATE.FAIL',
        error,
      };
    }
  }

  public static async getCartSummary(
    username: string,
  ): Promise<CustomResponse> {
    try {
      const cart = await Cart.findOne({ username, status: CartStatus.PENDING });
      const data = {
        totalItems: 0,
        totalPrice: 0,
        itemCount: 0,
      };
      if (!cart) {
        return {
          httpCode: 200,
          success: true,
          message: 'CART.SUMMARY.SUCCESS',
          data,
        };
      }

      const totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalPrice = cart.total;
      const itemCount = cart.items.length;

      data.totalItems = totalItems;
      data.totalPrice = totalPrice;
      data.itemCount = itemCount;
      return {
        httpCode: 200,
        success: true,
        message: 'CART.SUMMARY.SUCCESS',
        data,
      };
    } catch (error) {
      console.error('Get cart summary error:', error);
      return {
        httpCode: 500,
        success: false,
        message: 'CART.SUMMARY.FAIL',
        error,
      };
    }
  }
}
