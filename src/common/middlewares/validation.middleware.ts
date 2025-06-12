import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateRequest = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if(errors.length > 0) {
       const formattedErrors = errors.map(error => ({
        property: error.property,
        constraints: error.constraints,
        value: error.value
       }));

       return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors
       });
    }

    req.body = dtoObject;
    next();
  }
}