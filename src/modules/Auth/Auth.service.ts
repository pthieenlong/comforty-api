import express from 'express';
import CustomResponse from '@/types/custom/CustomResponse';
import { IRegisterInput } from '@/types/interface/User.type';
import { RegisterDTO, LoginDTO } from './Auth.dto';
import { User } from '../User/User.model';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { configModule } from '@/common/config/config.module';
import CustomRequest from '@/types/custom/CustomRequest';
import { EmailService } from '@/utils/email.service';

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

      // Kiểm tra email đã tồn tại
      const emailExist = await User.findOne({ email: inputValue.email })
      if(emailExist) {
        return {
          httpCode: 409,
          success: false,
          message: 'USER.REGISTER.EMAIL_EXIST'
        }
      }

      const hashedPassword = bcrypt.hashSync(inputValue.password, 10);
      
      // Tạo JWT verification token
      const verificationPayload = {
        email: inputValue.email,
        username: inputValue.username,
        type: 'email_verification',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 giờ
      };
      
      const verificationToken = jwt.sign(verificationPayload, configModule.getAccessToken());

      const user = new User({
        ...inputValue,
        _id: uuidv4(),
        password: hashedPassword,
        isVerified: 0 // UNVERIFIED
      })
      
      const isSuccess = await user.save();
      
      if(isSuccess) {
        // Gửi email xác thực
        const emailSent = await EmailService.sendVerificationEmail(
          inputValue.email,
          inputValue.username,
          verificationToken
        );

        if (emailSent) {
          return {
            httpCode: 201,
            success: true,
            message: 'USER.REGISTER.SUCCESS_EMAIL_SENT',
          }
        } else {
          return {
            httpCode: 201,
            success: true,
            message: 'USER.REGISTER.SUCCESS_EMAIL_FAIL',
          }
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

  // Xác thực email bằng JWT
  public static async verifyEmail(token: string): Promise<CustomResponse> {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, configModule.getAccessToken()) as any;
      
      // Kiểm tra loại token
      if (decoded.type !== 'email_verification') {
        return {
          httpCode: 400,
          success: false,
          message: 'USER.VERIFY.INVALID_TOKEN_TYPE'
        };
      }

      // Kiểm tra thời gian hết hạn
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return {
          httpCode: 400,
          success: false,
          message: 'USER.VERIFY.TOKEN_EXPIRED'
        };
      }

      // Tìm user theo email
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        return {
          httpCode: 404,
          success: false,
          message: 'USER.VERIFY.USER_NOT_FOUND'
        };
      }

      // Kiểm tra user đã được xác thực chưa
      if (user.isVerified === 1) {
        return {
          httpCode: 400,
          success: false,
          message: 'USER.VERIFY.ALREADY_VERIFIED'
        };
      }

      // Cập nhật trạng thái xác thực
      user.isVerified = 1; // VERIFIED
      await user.save();

      return {
        httpCode: 200,
        success: true,
        message: 'USER.VERIFY.SUCCESS'
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return {
          httpCode: 400,
          success: false,
          message: 'USER.VERIFY.INVALID_TOKEN'
        };
      }
      
      return {
        httpCode: 500,
        success: false,
        message: 'USER.VERIFY.FAIL',
        error
      };
    }
  }

  // Gửi lại email xác thực
  public static async resendVerificationEmail(email: string): Promise<CustomResponse> {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return {
          httpCode: 404,
          success: false,
          message: 'USER.RESEND.NOT_FOUND'
        };
      }

      if (user.isVerified === 1) {
        return {
          httpCode: 400,
          success: false,
          message: 'USER.RESEND.ALREADY_VERIFIED'
        };
      }

      // Tạo JWT token mới
      const verificationPayload = {
        email: user.email,
        username: user.username,
        type: 'email_verification',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 giờ
      };
      
      const verificationToken = jwt.sign(verificationPayload, configModule.getAccessToken());

      // Gửi email
      const emailSent = await EmailService.sendVerificationEmail(
        user.email,
        user.username,
        verificationToken
      );

      if (emailSent) {
        return {
          httpCode: 200,
          success: true,
          message: 'USER.RESEND.SUCCESS'
        };
      } else {
        return {
          httpCode: 500,
          success: false,
          message: 'USER.RESEND.EMAIL_FAIL'
        };
      }
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'USER.RESEND.FAIL',
        error
      };
    }
  }

  public static async login(inputValue: LoginDTO): Promise<CustomResponse> {
    try {
      const user = await User.findOne({ username: inputValue.username });
      if (!user)
        return {
          httpCode: 404,
          success: false,
          message: 'USER.LOGIN.NOT_FOUND',
        };
      const isPasswordCorrect = await bcrypt.compare(
        inputValue.password,
        user.password,
      );

      if (!isPasswordCorrect)
        return {
          httpCode: 409,
          success: false,
          message: 'USER.LOGIN.INCORRECT',
        };

      const payload = {
        info: {
          id: user._id,
          username: user.username,
          roles: user.roles,
        },
      };
      const refreshToken = jwt.sign(payload, configModule.getRefreshToken(), {
        expiresIn: '15d',
      });

      const accessToken = jwt.sign(payload, configModule.getAccessToken(), {
        expiresIn: '1d',
      });

      user.token = { accessToken, refreshToken };
      await user.save();
      return {
        httpCode: 200,
        success: true,
        message: 'USER.LOGIN.SUCCESS',
        data: {
          accessToken,
          refreshToken,
          UID: user._id,
          username: user.username,
          roles: user.roles,
        },
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'USER.LOGIN.CONFLICT',
        error,
      };
    }
  }

  public static async getAccessToken(
    refreshToken: string,
  ): Promise<CustomResponse> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        configModule.getRefreshToken(),
      ) as {
        info: {
          id: string;
          username: string;
          roles: string[];
        };
      };

      const user = await User.findOne({ username: decoded.info.username });
      if (!user || user.token.refreshToken !== refreshToken) {
        return {
          httpCode: 401,
          success: false,
          message: 'AUTH.VERIFY.MISSING_TOKEN',
        };
      }

      const newAccessToken = jwt.sign(
        { info: decoded.info },
        configModule.getAccessToken(),
        { expiresIn: '1d' },
      );

      user.token.accessToken = newAccessToken;
      await user.save();

      return {
        httpCode: 200,
        success: true,
        message: 'TOKEN.GET.SUCCESS',
        data: { accessToken: newAccessToken, refreshToken },
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'TOKEN.GET.CONFLICT',
        error,
      };
    }
  }

  public static async sendVerifyEmail() {}
}
