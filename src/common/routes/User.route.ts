import express from 'express';
import UserController from '@modules/User/User.controller';
import AuthVerifyMiddleware from '@middlewares/AuthVerify.middleware';
import { canRead, canUpdate } from '../middlewares/casl.middleware';

const userRoute = express.Router();
const userController = new UserController();

userRoute
  .route('/:username')
  .get(userController.getUser)
  .patch(userController.updateUser);

export default userRoute;
