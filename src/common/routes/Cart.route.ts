import express from 'express';
import UserController from '@modules/User/User.controller';
import AuthVerifyMiddleware from '@middlewares/AuthVerify.middleware';
import { canRead, canUpdate } from '../middlewares/casl.middleware';
import CartController from '@/modules/Cart/Cart.controller';

const cartRoute = express.Router();
const cartController = new CartController();

// cartRoute.use(AuthVerifyMiddleware);

cartRoute.route('/:username').get(cartController.getCartByUser);
cartRoute.route('/:username/sync').post(cartController.syncCart);
cartRoute
  .route('/:username/product')
  .post(cartController.addProduct)
  .patch(cartController.decreaseItem)
  .delete(cartController.removeItem);
cartRoute.route('/:username/checkout').post(cartController.checkout);
export default cartRoute;
