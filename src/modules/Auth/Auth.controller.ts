import { Request, Response } from "express";
import { ValidateRequest } from "@/common/decorators/validation.decorator";
import { LoginDTO, RegisterDTO } from "./Auth.dto";
import CustomResponse from "@/types/custom/CustomResponse";
import AuthService from "./Auth.service";
import { configModule } from "@/common/config/config.module";
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
      return res.cookie('accessToken', result.data?.accessToken as string, {
        httpOnly: true,
        secure: configModule.getHttpSecure() === 0 ? false : true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      }).status(result.httpCode).json(result)
    }
    else return res.status(result.httpCode).json(result);
  }
}