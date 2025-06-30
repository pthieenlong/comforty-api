import express from 'express';
import ProductController from '@/modules/Product/Product.controller';
import AuthVerifyMiddleware from '@middlewares/AuthVerify.middleware';
import { adminOnly, canRead, canUpdate } from '../middlewares/casl.middleware';

const productRoute = express.Router();
const productController = new ProductController();

productRoute
  .route('')
  .post(AuthVerifyMiddleware, adminOnly(), productController.createProduct)
  .get((req, res, next) => {
    if(req.query.c) {
      return productController.getAllProductsWithCategorySlug(req, res);
    } else {
      return productController.getAllProducts(req, res);
    }
  });
  
  // productRoute
  // .route('/cate')

productRoute
  .route('/:slug')
  .get(productController.getProductBySlug)


export default productRoute;
