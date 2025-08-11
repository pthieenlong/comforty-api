import { NextFunction, Request, Response } from 'express';
import { UserService } from './User.service';
import CustomResponse from '../../types/custom/CustomResponse';
import { ValidateRequest } from '@/common/decorators/validation.decorator';
import { UserUpdateDTO } from './User.dto';
import { Upload } from '@/common/decorators/file.decorator';

export default class UserController {
  public async getUser(req: Request, res: Response): Promise<any> {
    const users = await UserService.getUser(req.params.username);
    return res.json(users);
  }

  public async createUser(req: Request, res: Response): Promise<any> {
    const user = await UserService.createUser();
    return res.json(user);
  }

  @Upload({
    fieldName: 'avatar',
    maxSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/png'],
    multiple: false,
  })
  @ValidateRequest(UserUpdateDTO)
  public async updateUser(req: Request, res: Response): Promise<any> {
    try {
      const input: UserUpdateDTO = req.body;
      const username: string = req.params.username;
      if (req.file) {
        input.avatar = `public/uploads/avatars/${req.file.filename}`;
      }
      const result = await UserService.updateUserInformations(username, input);
      return res.status(result.httpCode).json(result);
    } catch (error) {
      return res.status(500).json({
        httpCode: 500,
        success: false,
        message: 'USER.UPDATE.ERROR',
        error,
      });
    }
  }
}
