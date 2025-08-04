import mongoose, { Document, Schema } from 'mongoose';
import { CartStatus, ICartItem } from '@/types/interface/Cart.type';

export default interface ICart extends Document {
  _id: string;
  username: string;
  items: ICartItem[];
  total: number;
  status: CartStatus;
  createdAt: Date;
}

const CartSchema: Schema = new Schema<ICart>({
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  items: {
    type: [],
    required: false,
    default: [],
  },
  total: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: CartStatus.PENDING,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export const Cart = mongoose.model<ICart>('Cart', CartSchema);
