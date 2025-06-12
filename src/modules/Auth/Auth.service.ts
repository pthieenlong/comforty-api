import express from 'express'
import CustomResponse from '@/types/custom/CustomResponse'
import { IRegisterInput } from '@/types/interface/User.type';
import { RegisterDTO } from './Auth.dto';
import { User } from '../User/User.model';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
export default class AuthService {
  public static async register(inputValue: RegisterDTO): Promise<CustomResponse> {
    try {
      const isExist = await User.findOne({ username: inputValue.username})
      if(isExist) {
        return {
          httpCode: 409,
          success: false,
          message: 'USER.REGISTER.EXIST'
        }
      }
      const hashedPassword = bcrypt.hashSync(inputValue.password, 10);
      const user = new User({
        ...inputValue,
        _id: uuidv4(),
        password: hashedPassword
      })
      const isSuccess = await user.save();
      if(isSuccess) {
        return {
          httpCode: 201,
          success: true,
          message: 'USER.REGISTER.SUCCESS',
        }
      }
      return {
          httpCode: 409,
          success: false,
          message: 'USER.REGISTER.FAIL',
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'USER.REGISTER.FAIL',
        error
      };
    }
    
  }
}