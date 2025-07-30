import mongoose, { Document, Schema } from 'mongoose';
import ICategory from '../Category/Category.model';

export interface IProduct extends Document {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images: string[];
  salePercent: number;
  isSale: boolean;
  category: string[];
  rating: number;
  colors: string[];
  isVisible: boolean;
  shortDesc: string;
  longDesc: string;
  updatedAt: Date;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    default: ['https://placehold.co/600x400'],
  },
  salePercent: {
    type: Number,
    default: 0,
  },
  isSale: {
    type: Boolean,
    default: false,
  },
  category: {
    type: [String],
    ref: 'Category',
    default: ['Ban'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  colors: {
    type: [String],
    default: ['#1E1E1E', '#B26F3F', '#F7AD94'],
  },
  shortDesc: {
    type: String,
  },
  longDesc: {
    type: String,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export const Product = mongoose.model<IProduct>('Product', ProductSchema);
