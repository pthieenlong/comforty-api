import AuthController from '@/modules/Auth/Auth.controller';
import express, { Response, Request, response, request, NextFunction } from 'express';
import AuthVerifyMiddleware from '../middlewares/AuthVerify.middleware';
import { canUpdate } from '../middlewares/casl.middleware';

const authRoute = express.Router();
const authController = new AuthController()
authRoute
  .route('/register')
  .post(authController.register)

authRoute
  .route('/login')
  .post(authController.login);


authRoute
  .route('/token')
  .post(canUpdate('User'),authController.getAccessToken)
export default authRoute;
