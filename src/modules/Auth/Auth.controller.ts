import { Request, Response } from "express";
import { ValidateRequest } from "@/common/decorators/validation.decorator";
import { RegisterDTO } from "./Auth.dto";
import CustomResponse from "@/types/custom/CustomResponse";
import AuthService from "./Auth.service";

export default class AuthController {
  @ValidateRequest(RegisterDTO)
  public async register(req: Request, res: Response): Promise<any> {
    const userData = req.body;
    const result = await AuthService.register(userData)
    return res.status(200).json(result);
  }
}