import express from 'express';
import userRoute from './User.route';

const mainRouter = express.Router();

mainRouter.use('/user', userRoute);

export default mainRouter;
