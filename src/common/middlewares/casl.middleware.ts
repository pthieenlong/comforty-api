import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@casl/ability';
import { caslModule, Actions, Subjects, AppAbility } from '@/common/config/casl.module';
import CustomRequest from '@/types/custom/CustomRequest';

export interface CASLOptions {
  action: Actions;
  subject: Subjects;
  field?: string;
}

export const caslMiddleware = (options: CASLOptions) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!caslModule.validatePermission(options.action, options.subject)) {
        res.status(400).json({
          httpCode: 400,
          success: false,
          message: 'INVALID_PERMISSION_CONFIG'
        });
        return;
      }

      const user = req.userID ? {
        _id: req.userID,
        username: req.username!,
        roles: req.roles!
      } : null;
      const ability = caslModule.createAbilityForUser({
        _id: user?._id,
        username: user?.username,
        roles: user?.roles,
      });

      ForbiddenError.from(ability).throwUnlessCan(
        options.action,
        options.subject,
        options.field
      );

      req.ability = ability;

      next();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        res.status(403).json({
          httpCode: 403,
          success: false,
          message: 'ACCESS.DENIED'
        });
        return;
      }
      
      res.status(500).json({
        httpCode: 500,
        success: false,
        message: 'INTERNAL_ERROR'
      });
      return;
    }
  };
};

// Simple convenience functions
export const canRead = (subject: Subjects) => 
  caslMiddleware({ action: Actions.READ, subject });

export const canCreate = (subject: Subjects) => 
  caslMiddleware({ action: Actions.CREATE, subject });

export const canUpdate = (subject: Subjects) => 
  caslMiddleware({ action: Actions.UPDATE, subject });

export const canDelete = (subject: Subjects) => 
  caslMiddleware({ action: Actions.DELETE, subject });

export const canManage = (subject: Subjects) => 
  caslMiddleware({ action: Actions.MANAGE, subject });

// Admin only middleware
export const adminOnly = () => 
  caslMiddleware({ action: Actions.MANAGE, subject: 'all' });

// Custom middleware for specific conditions
export const canManageOwn = (subject: Subjects) => 
  caslMiddleware({ action: Actions.MANAGE, subject });