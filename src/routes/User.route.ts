import express from 'express';
import UserController from "../controllers/User.controller";

const userRoute = express.Router();
const userController = new UserController();
userRoute.route('/')
    .get(userController.getUser)
    .post(userController.createUser)

export default userRoute;