import AuthController from '@/modules/Auth/Auth.controller';
import express, { Response, Request, response, request, NextFunction } from 'express';

const authRoute = express.Router();
const authController = new AuthController()
authRoute
  .route('/register')
  .post(authController.register)

export default authRoute;
