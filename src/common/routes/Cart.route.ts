import express from 'express';
import UserController from '@modules/User/User.controller';
import AuthVerifyMiddleware from '@middlewares/AuthVerify.middleware';
import { canRead, canUpdate } from '../middlewares/casl.middleware';
import CartController from '@/modules/Cart/Cart.controller';

const cartRoute = express.Router();
const cartController = new CartController();

cartRoute.use(AuthVerifyMiddleware);

cartRoute
  .route('/:username')
  .get(cartController.getAllCart)
  .post(cartController.addProduct);
export default cartRoute;
