import express from 'express';
import CategoryController from '@/modules/Category/Category.controller';
import {
  adminOnly,
  canCreate,
  canRead,
  canUpdate,
} from '../middlewares/casl.middleware';
import AuthVerifyMiddleware from '../middlewares/AuthVerify.middleware';

const categoryRoute = express.Router();
const categoryController = new CategoryController();

categoryRoute
  .route('/')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);
categoryRoute
  .route('/count')
  .get(categoryController.getCategoriesWithProductCount);
categoryRoute
  .route('/:slug')
  .get(categoryController.getProductsByCategorySlug)
  .patch(categoryController.updateCategoryBySlug)
  .delete(categoryController.removeCategoryBySlug);
export default categoryRoute;
