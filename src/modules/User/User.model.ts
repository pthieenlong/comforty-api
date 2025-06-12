import mongoose, { Schema, Document } from 'mongoose';
import { ERole, EVerify } from '@/types/interface/User.type';

export interface IUser extends Document {
  _id: string;
  roles: ERole[];
  username: string;
  email: string;
  fullname: string;
  password: string;
  phone: string;
  description: string;
  avatar: string;
  school: {
    schoolID: string;
    schoolName: string;
  };
  isVerified: EVerify,
  token: {
    refreshToken: string,
    accessToken: string
  }
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    _id: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: ERole,
        required: true,
        default: [ERole.USER]
      }
    ],
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    fullname: {
      type: String,
    },
    phone: {
      type: String,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
      default: ''
    },
    school: {
      type: {
        schoolID: String,
        schoolName: String
      },
    },
    isVerified: {
      default: EVerify.UNVERIFIED
    },
    token: {
      type: {
        refreshToken: String,
        accessToken: String
      },
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    } 
  },
  {
    versionKey: false,
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
