import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "../Product/Product.model";
import { CartStatus } from "@/types/interface/Cart.type";
export default interface ICartItem extends Document {
  _id: string,
  userID: string,
  product: IProduct,
  quantity: number,
  total: number,
  status: CartStatus,
  createAt: string
}

