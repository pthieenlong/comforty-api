import { NextFunction, Request, Response } from 'express';
import { UserService } from './User.service';
import CustomResponse from '../../types/custom/CustomResponse';

export default class UserController {
  public async getUser(
    req: Request,
    res: Response,
  ): Promise<any> {
    const users = await UserService.getUser(req.params.username);
    return res.json(users);
  }

  public async createUser(
    req: Request,
    res: Response,
  ): Promise<any> {
    const user = await UserService.createUser();
    return res.json(user);
  }
}
