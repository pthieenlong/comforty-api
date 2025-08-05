import { ICartItem, CartStatus } from "./Cart.type";

export interface IOrderInput {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  items: ICartItem[];
  status: CartStatus;
  total: number;
  username?: string;
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
}