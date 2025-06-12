import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
export function ValidateRequest(dtoClass: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const dtoObject = plainToClass(dtoClass, req.body);

      const errors = await validate(dtoObject);
      if(errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors
        })
      }

      req.body = dtoObject;
      return originalMethod.call(this, req, res, next);
    };

    return descriptor;
  }
}

function formatValidationErrors(errors: ValidationError[]) : any[] {
  return errors.map(error => ({
    property: error.property,
    constraints: error.constraints,
    value: error.value
  }))
}