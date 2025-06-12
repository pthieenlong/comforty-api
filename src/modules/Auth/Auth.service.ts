import express from 'express'
import CustomResponse from '@/types/custom/CustomResponse'
import { IRegisterInput } from '@/types/interface/User.type';
import { RegisterDTO, LoginDTO } from './Auth.dto';
import { User } from '../User/User.model';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { configModule } from '@/common/config/config.module';
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
        message: 'USER.REGISTER.CONFLICT',
        error
      };
    }
    
  }

  public static async login(inputValue: LoginDTO): Promise<CustomResponse> {
    try {
      const user = await User.findOne({ username: inputValue.username });
      if(!user) 
        return {
          httpCode: 404,
          success: false,
          message: 'USER.LOGIN.NOT_FOUND'
        }
      const isPasswordCorrect = await bcrypt.compare(inputValue.password, user.password);

      if(!isPasswordCorrect) 
        return {
          httpCode: 409,
          success: false,
          message: 'USER.LOGIN.INCORRECT'
        }

      const payload = {
        info: {
          id: user._id,
          username: user.username,
          roles: user.roles,
        }
      }
      const refreshToken = jwt.sign(payload, configModule.getRefreshToken(), { expiresIn: '15d' });

      const accessToken = jwt.sign(payload, configModule.getAccessToken(), { expiresIn: '1d' });

      user.token = { accessToken, refreshToken };
      await user.save();
      return {
        httpCode: 200,
        success: true,
        message: 'USER.LOGIN.SUCCESS',
        data: { accessToken }
      }
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'USER.LOGIN.CONFLICT',
        error
      }
    }
  }
}