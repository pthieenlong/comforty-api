import express from 'express';
import UserController from '@modules/User/User.controller';

const userRoute = express.Router();

const userController = new UserController();

//api/user/
userRoute
  .route('/:username')
  .get(userController.getUser)

export default userRoute;
