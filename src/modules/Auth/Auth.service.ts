import express from 'express'
import CustomResponse from '@/types/custom/CustomResponse'
import { IRegisterInput } from '@/types/interface/User.type';

export default class AuthService {
  public static async register(userInput: IRegisterInput): Promise<CustomResponse> {

      return {
          httpCode: 409,
          success: false,
          message: 'USER.REGISTER.REQUIRED',
      };
    }

}