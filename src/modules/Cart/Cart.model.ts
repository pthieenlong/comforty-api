import mongoose, { Document, Schema } from 'mongoose';
import { CartStatus } from '@/types/interface/Cart.type';

export default interface ICart extends Document {
  _id: string;
  username: string;
  products: [
    {
      slug: string;
      name: string;
      image: string;
      quantity: number;
      price: number;
    },
  ];
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
  products: {
    type: [
      {
        slug: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
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
