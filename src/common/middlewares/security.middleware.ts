import helmet from "helmet";
import cors from 'cors';
import rateLimit from "express-rate-limit";
import csrf from 'csurf';
import { Express, Request, Response, NextFunction } from 'express';
import { configModule } from "@config/config.module";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "REQUEST.SEND.TOO_MANY"
  }
});

const corsOptions = {
  origin: configModule.getAllowedOrigins().split(',') || `http://localhost:${configModule.getPort()}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: configModule.getHttpSecure() === 1,
    sameSite: 'strict'
  }
});

export const configureSecurity = (app: Express) => {
  app.use(helmet());

  app.use(cors(corsOptions));

  app.use('/api/', limiter);

  app.use((req, res, next) => {
    if(req.path.startsWith('/api/auth')) {
      next();
    } else {
      csrfProtection(req, res, next);
    }
  })

  app.use((req, res, next) => {
    if(req.csrfToken) {
      res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
  })
}
