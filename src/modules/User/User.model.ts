import mongoose, { Schema, Document } from 'mongoose';
import { ERole, EVerify } from '@/types/interface/User.type';

export interface IUser extends Document {
  _id: string;
  roles: ERole[];
  username: string;
  password: string;
  email: string;
  fullname: string;
  phone: string;
  address: string;
  avatar: string;
  isVerified: EVerify;
  token: {
    refreshToken: string;
    accessToken: string;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    _id: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: Object.values(ERole),
      required: true,
      default: [ERole.USER],
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Number,
      default: EVerify.UNVERIFIED,
    },
    token: {
      type: {
        refreshToken: String,
        accessToken: String,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
