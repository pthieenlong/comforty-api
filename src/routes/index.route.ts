import express from 'express';
import userRoute from './User.route';
import authRoute from './Auth.route';

const mainRouter = express.Router();

mainRouter.use('/user', userRoute);
mainRouter.use('/auth', authRoute);
export default mainRouter;
