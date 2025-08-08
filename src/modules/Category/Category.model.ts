import mongoose, { Document, Schema } from 'mongoose';

export default interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  isVisible: boolean;
}

const CategorySchema: Schema = new Schema<ICategory>({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});
export const Category = mongoose.model<ICategory>('Category', CategorySchema);
