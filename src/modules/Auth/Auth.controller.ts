import { Request, Response } from "express";
import { ValidateRequest } from "@/common/decorators/validation.decorator";
import { LoginDTO, RegisterDTO } from "./Auth.dto";
import CustomResponse from "@/types/custom/CustomResponse";
import AuthService from "./Auth.service";
import { configModule } from "@/common/config/config.module";
import CustomRequest from "@/types/custom/CustomRequest";
export default class AuthController {
  @ValidateRequest(RegisterDTO)
  public async register(req: Request, res: Response): Promise<any> {
    const userData = req.body;
    const result = await AuthService.register(userData)
    return res.status(result.httpCode).json(result);
  }

  @ValidateRequest(LoginDTO)
  public async login(req: Request, res: Response): Promise<any> {
    const input = req.body;
    const result = await AuthService.login(input);

    if(result.success) {
      const tokenOptions = {
        httpOnly: true,
        secure: configModule.getHttpSecure() === 1,
      }
      res.cookie('refreshToken', result.data?.refreshToken as string, {
        ...tokenOptions, sameSite: 'strict', maxAge: 15 * 24 * 60 * 60 * 1000
      })
      res.cookie('accessToken', result.data?.accessToken as string, {
        ...tokenOptions, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000
      })
      return res.status(result.httpCode).json({
        httpCode: result.httpCode,
        success: result.success,
        message: result.message
      })
    }
    else return res.status(result.httpCode).json(result);
  }

  public async getAccessToken(req: CustomRequest, res: Response): Promise<any> {
    const refreshToken = req.cookies.refreshToken;
    const result = await AuthService.getAccessToken(refreshToken);

    if(result.success) {
      return res.cookie('accessToken', result.data?.accessToken as string, {
        httpOnly: true,
        secure: configModule.getHttpSecure() === 1,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      }).status(result.httpCode).json({
        httpCode: result.httpCode,
        success: result.success,
        message: result.message
      })
    }
    return res.status(result.httpCode).json({ result })
  }

}