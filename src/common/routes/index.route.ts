import express from 'express';
import userRoute from './User.route';
import authRoute from './Auth.route';
import commentRoute from './Comment.route';

const mainRouter = express.Router();

mainRouter.use('/user', userRoute);
mainRouter.use('/auth', authRoute);
mainRouter.use('/comment', commentRoute);

export default mainRouter;
