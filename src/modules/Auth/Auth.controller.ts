import { Request, Response } from 'express';
import { ValidateRequest } from '@/common/decorators/validation.decorator';
import {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
} from './Auth.dto';
import CustomResponse from '@/types/custom/CustomResponse';
import AuthService from './Auth.service';
import { configModule } from '@/common/config/config.module';
import CustomRequest from '@/types/custom/CustomRequest';

export default class AuthController {
  @ValidateRequest(RegisterDTO)
  public async register(req: Request, res: Response): Promise<any> {
    const userData = req.body;
    const result = await AuthService.register(userData);
    return res.status(result.httpCode).json(result);
  }

  @ValidateRequest(LoginDTO)
  public async login(req: Request, res: Response): Promise<any> {
    const input = req.body;
    const result = await AuthService.login(input);

    if (result.success) {
      const tokenOptions = {
        httpOnly: true,
        secure: configModule.getHttpSecure() === 1,
      };
      res.cookie('refreshToken', result.data?.refreshToken as string, {
        ...tokenOptions,
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });
      res.cookie('accessToken', result.data?.accessToken as string, {
        ...tokenOptions,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      const safeDataResponse = {
        UID: result?.data?.UID,
        username: result?.data?.username,
        roles: result?.data?.roles,
      };
      console.log(safeDataResponse);
      return res.status(result.httpCode).json({
        httpCode: result.httpCode,
        success: result.success,
        message: result.message,
        data: safeDataResponse,
      });
    } else return res.status(result.httpCode).json(result);
  }

  public async getAccessToken(req: CustomRequest, res: Response): Promise<any> {
    const refreshToken = req.cookies.refreshToken;
    const result = await AuthService.getAccessToken(refreshToken);

    if (result.success) {
      return res
        .cookie('accessToken', result.data?.accessToken as string, {
          httpOnly: true,
          secure: configModule.getHttpSecure() === 1,
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(result.httpCode)
        .json({
          httpCode: result.httpCode,
          success: result.success,
          message: result.message,
        });
    }
    return res.status(result.httpCode).json({ result });
  }

  public async verifyEmail(req: Request, res: Response): Promise<any> {
    try {
      const { token } = req.body;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'USER.VERIFY.INVALID_TOKEN',
        });
      }

      const result = await AuthService.verifyEmail(token);
      return res.status(result.httpCode).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'USER.VERIFY.FAIL',
        error,
      });
    }
  }

  public async resendVerificationEmail(
    req: Request,
    res: Response,
  ): Promise<any> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'USER.RESEND.EMAIL_REQUIRED',
        });
      }

      const result = await AuthService.resendVerificationEmail(email);
      return res.status(result.httpCode).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'USER.RESEND.FAIL',
        error,
      });
    }
  }

  @ValidateRequest(ForgotPasswordDTO)
  public async forgotPassword(req: Request, res: Response): Promise<any> {
    const input = req.body;
    const result = await AuthService.forgotPassword(input);
    return res.status(result.httpCode).json(result);
  }

  @ValidateRequest(ResetPasswordDTO)
  public async resetPassword(req: Request, res: Response): Promise<any> {
    const input = req.body;
    const result = await AuthService.resetPassword(input);
    return res.status(result.httpCode).json(result);
  }

  @ValidateRequest(UpdatePasswordDTO)
  public async updatePassword(req: Request, res: Response): Promise<any> {
    const input = req.body;
    const { username } = req.params;
    const result = await AuthService.updatePassword(username, input);
    return res.status(result.httpCode).json(result);
  }
}
