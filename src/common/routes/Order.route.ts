import express from 'express';
import OrderController from '@/modules/Order/Order.controller';

const orderRoute = express.Router();
const orderController = new OrderController();

orderRoute.route('/:username').get((req, res, next) => {
  if (req.query.id) {
    return orderController.getOrderDetails(req, res);
  } else {
    return orderController.getAllOrdersByUsername(req, res);
  }
});
orderRoute.route('/checkout').post(orderController.checkout);

export default orderRoute;
