import express from 'express';
import UserController from '@modules/User/User.controller';

const userRoute = express.Router();

const userController = new UserController();

//api/user/
userRoute
  .route('/')
  .get(userController.getUser)
  .post(userController.createUser);

export default userRoute;
