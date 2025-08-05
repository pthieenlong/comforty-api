import { CartStatus, ICartItem } from "@/types/interface/Cart.type";
import mongoose, { Document, Schema } from "mongoose";
export default interface IOrder extends Document {
  _id: string;
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
  updatedAt?: Date;
  createdAt?: Date;
}

const OrderSchema: Schema = new Schema<IOrder>({
  _id: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  items: {
    type: [],
    required: true,
  },
  subtotal: {
    type: Number,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: CartStatus.SHIPPING
  },
  discount: {
    type: Number,
  },
  shippingFee: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
})
export const Order = mongoose.model<IOrder>('Order', OrderSchema);