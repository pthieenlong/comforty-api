import { User } from '../models/User';
import CustomRequest from '../types/custom/CustomRequest';
import CustomResponse from '../types/custom/CustomResponse';

export class UserService {
  public static async getUser(): Promise<CustomResponse> {
    try {
      const user = await User.find();
      return {
        httpCode: 200,
        success: true,
        message: 'USER.GET.SUCCESS',
        data: user,
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'USER.GET.FAIL',
      };
    }
  }
  public static async createUser(): Promise<CustomResponse> {
    try {
      const user = new User({
        name: 'Test name',
        email: 'Test email',
        createdAt: new Date(),
      });
      const isSuccess = await user.save();
      return {
        httpCode: 200,
        success: true,
        message: 'USER.GET.SUCCESS',
        data: user,
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'USER.GET.FAIL',
      };
    }
  }
}
