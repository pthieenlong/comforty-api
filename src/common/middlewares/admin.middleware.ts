import CustomRequest from '@/types/custom/CustomRequest';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { configModule } from '../config/config.module';
import { ERole } from '@/types/interface/User.type';
export default async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(401).json({
        httpCode: 401,
        success: false,
        message: 'AUTH.LOGIN.REQUIRED',
      });
      return;
    }

    const decoded = jwt.verify(token, configModule.getAccessToken()) as {
      info: {
        id: string;
        username: string;
        roles: ERole[];
      };
    };

    if (decoded.info.roles.includes(ERole.ADMIN)) {
      req.userID = decoded.info.id;
      req.username = decoded.info.username;
      req.roles = decoded.info.roles;
      next();
    } else {
      res.status(403).json({
        httpCode: 403,
        success: false,
        message: 'AUTH.ACCESS_DENIED',
      });
    }
  } catch (error) {
    res.status(401).json({
      httpCode: 401,
      success: false,
      message: 'AUTH.LOGIN.INVALID_TOKEN',
    });
  }
};
