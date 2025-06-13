import express from 'express';
import UserController from '@modules/User/User.controller';
import AuthVerifyMiddleware from '@middlewares/AuthVerify.middleware';

const userRoute = express.Router();

const userController = new UserController();

userRoute
  .route('/:username')
  .get(AuthVerifyMiddleware,userController.getUser)

export default userRoute;
