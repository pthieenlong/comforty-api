import { User } from './User.model';
import { UserUpdateDTO } from './User.dto';
import CustomResponse from '@/types/custom/CustomResponse';
export class UserService {
  public static async getUser(username: string): Promise<CustomResponse> {
    try {
      const userSchema = await User.findOne({ username });
      const data = {
        username: userSchema?.username,
        email: userSchema?.email,
        phone: userSchema?.phone,
        avatar: userSchema?.avatar,
        fullname: userSchema?.fullname,
        address: userSchema?.address,
        isVerified: userSchema?.isVerified,
        createdAt: userSchema?.createdAt,
      };
      return {
        httpCode: 200,
        success: true,
        message: 'USER.GET.SUCCESS',
        data,
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
        httpCode: 409,
        success: false,
        message: 'USER.GET.FAIL',
      };
    }
  }
  public static async updateUserInformations(input: UserUpdateDTO): Promise<CustomResponse> {
    try {
      return {
        httpCode: 409,
        success: false,
        message: 'USER.GET.FAIL',
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'USER.UPDATE.CONFLICT',
        error: error
      };
    }
  }
}
