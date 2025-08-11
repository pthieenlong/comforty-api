import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

interface UploadConfig {
  fieldName: string;
  maxCount?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  dest?: string;
  multiple?: boolean;
}

export function Upload(config: UploadConfig) {
  const {
    fieldName,
    maxCount = 5,
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    dest = path.join(__dirname, '../../', 'public/images/avatars'),
    multiple = false,
  } = config;

  // Tạo folder nếu chưa tồn tại
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Cấu hình storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      cb(null, `${baseName}-${Date.now()}${ext}`);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
    cb(null, true);
  };

  const uploader = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  })[multiple ? 'array' : 'single'](fieldName, multiple ? maxCount : undefined);

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      uploader(req, res, (err: any) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'USER.UPDATE.ERROR',
            error: err.message || err,
          });
        }
        return originalMethod.call(this, req, res, next);
      });
    };

    return descriptor;
  };
}
