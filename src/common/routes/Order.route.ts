import express from 'express';
import OrderController from '@/modules/Order/Order.controller';

const orderRoute = express.Router();
const orderController = new OrderController();

// User routes
orderRoute.route('/:username').get((req, res, next) => {
  if (req.query.id) {
    return orderController.getOrderDetails(req, res);
  } else {
    return orderController.getAllOrdersByUsername(req, res);
  }
});
orderRoute
  .route('/:username/statistics')
  .get(orderController.getOrderStatistics);
orderRoute
  .route('/:username/orders/:orderId/status')
  .patch(orderController.updateOrderStatus);

// Public routes
orderRoute.route('/checkout').post(orderController.checkout);

// Admin routes
orderRoute.route('/admin/orders').get(orderController.getAllOrdersAdmin);
orderRoute.route('/admin/orders/:id').get(orderController.getOrderDetailsByID);
orderRoute
  .route('/admin/orders/:orderId/status')
  .patch(orderController.updateOrderStatusAdmin);
orderRoute
  .route('/admin/statistics')
  .get(orderController.getOrderStatisticsAdmin);

export default orderRoute;
