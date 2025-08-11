import AuthController from '@/modules/Auth/Auth.controller';
import express, {
  Response,
  Request,
  response,
  request,
  NextFunction,
} from 'express';
import AuthVerifyMiddleware from '../middlewares/AuthVerify.middleware';
import { canUpdate } from '../middlewares/casl.middleware';

const authRoute = express.Router();
const authController = new AuthController();

authRoute.route('/register').post(authController.register);

authRoute.route('/login').post(authController.login);

authRoute
  .route('/token')
  .post(canUpdate('User'), authController.getAccessToken);

authRoute.route('/verify-email').post(authController.verifyEmail);

authRoute
  .route('/resend-verification')
  .post(authController.resendVerificationEmail);

authRoute.route('/forgot-password').post(authController.forgotPassword);
authRoute.route('/reset-password').post(authController.resetPassword);
authRoute
  .route('/:username/update-password')
  .patch(authController.updatePassword);
export default authRoute;
