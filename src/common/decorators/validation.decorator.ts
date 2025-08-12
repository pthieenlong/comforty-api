import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function ValidateRequest(dtoClass: any) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      try {
        // Đảm bảo req.body tồn tại và là object
        const bodyToValidate = req.body || {};

        // Kiểm tra nếu bodyToValidate là object hợp lệ
        if (typeof bodyToValidate !== 'object' || bodyToValidate === null) {
          return res.status(400).json({
            success: false,
            message: 'Invalid request body',
            errors: [],
          });
        }

        const dtoObject = plainToClass(dtoClass, bodyToValidate);
        const errors = await validate(dtoObject);

        if (errors.length > 0) {
          const formattedErrors = formatValidationErrors(errors);

          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
          });
        }

        req.body = dtoObject;
        return originalMethod.call(this, req, res, next);
      } catch (error) {
        console.error('Validation error:', error);
        return res.status(400).json({
          success: false,
          message: 'Validation processing error',
          error: error,
        });
      }
    };

    return descriptor;
  };
}

function formatValidationErrors(errors: ValidationError[]): any[] {
  return errors.map((error) => ({
    property: error.property,
    constraints: error.constraints,
    value: error.value,
  }));
}
