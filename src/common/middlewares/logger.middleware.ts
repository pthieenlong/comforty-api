import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  const requestLog = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
  };

  logger.info('Incoming Request', requestLog);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const responseLog = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    logger.info('Request Completed', responseLog);
  });

  next();
};

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  next(err);
};