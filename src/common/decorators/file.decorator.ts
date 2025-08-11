import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

interface UploadConfig {
  fieldName: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  dest?: string;
}

export function UploadFile(config: UploadConfig) {
  const {
    fieldName,
    maxSizeMB = 2,
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    dest = 'uploads'
  } = config;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    }
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
    cb(null, true);
  };

  const uploader = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 }
  }).single(fieldName);

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      uploader(req, res, (err: any) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "USER.UPDATE.ERROR",
            error: err.message || err
          });
        }
        return originalMethod.call(this, req, res, next);
      });
    };

    return descriptor;
  };
}
