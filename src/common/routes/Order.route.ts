import express from 'express';
import OrderController from '@/modules/Order/Order.controller';

const orderRoute = express.Router();
const orderController = new OrderController();


orderRoute.route('/:username').get(orderController.getAllOrdersByUsername);
orderRoute.route('/checkout').post(orderController.checkout);
export default orderRoute;
