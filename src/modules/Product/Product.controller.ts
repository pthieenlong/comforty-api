import { ValidateRequest } from '@/common/decorators/validation.decorator';
import ProductService from './Product.service';
import { Request, Response } from 'express';
import { CreateProductDTO, UpdateProductDTO } from './Product.dto';
import { Upload } from '@/common/decorators/file.decorator';
export default class ProductController {
  public async getProductBySlug(req: Request, res: Response): Promise<any> {
    const slug = req.params.slug;
    const product = await ProductService.getProductBySlug(slug);

    return res.status(product.httpCode).json(product);
  }
  @Upload({
    fieldName: 'images',
    maxCount: 10,
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    multiple: true,
    subfolder: 'products',
  })
  @ValidateRequest(CreateProductDTO)
  public async createProduct(req: Request, res: Response): Promise<any> {
    try {
      const productInput = req.body;
      const files = req.files as Express.Multer.File[];

      if (files && files.length > 0) {
        const imagePaths = files.map(
          (file) => `http://localhost:3000/images/products/${file.filename}`,
        );
        productInput.images = imagePaths;
      }

      const result = await ProductService.createProduct(productInput);

      return res.status(result.httpCode).json(result);
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({
        httpCode: 500,
        success: false,
        message: 'PRODUCT.CREATE.ERROR',
        error: error,
      });
    }
  }

  public async getAllProductsWithCategorySlug(
    req: Request,
    res: Response,
  ): Promise<any> {
    const categorySlug = req.query.category;
    const results = await ProductService.getAllProductsWithCategorySlug(
      categorySlug as string,
    );
    return res.status(results.httpCode).json(results);
  }

  public async getAllProducts(req: Request, res: Response) {
    const { page } = req.query;
    const result = await ProductService.getAllProducts(
      parseInt((page as string) ?? 1),
    );
    return res.status(result.httpCode).json(result);
  }

  public async getBestProducts(req: Request, res: Response): Promise<any> {
    const results = await ProductService.getBestProducts();
    return res.status(results.httpCode).json(results);
  }

  public async getProductsByLimit(req: Request, res: Response): Promise<any> {
    const results = await ProductService.getProductsByLimit('8');
    return res.status(results.httpCode).json(results);
  }
  public async getNewProducts(req: Request, res: Response): Promise<any> {
    const results = await ProductService.getNewProducts('4');
    return res.status(results.httpCode).json(results);
  }
  public async getSaleProducts(req: Request, res: Response): Promise<any> {
    const results = await ProductService.getSaleProducts();
    return res.status(results.httpCode).json(results);
  }
  public async getSearchProducts(req: Request, res: Response): Promise<any> {
    const query = req.query.search;
    const result = await ProductService.getSearchProducts(query as string);
    return res.status(result.httpCode).json(result);
  }

  public async updateProductSale(req: Request, res: Response): Promise<any> {
    const slug = req.params.slug;

    const result = await ProductService.updateProductSale(slug as string);

    return res.status(result.httpCode).json(result);
  }
  public async updateProductVisible(req: Request, res: Response): Promise<any> {
    const slug = req.params.slug;

    const result = await ProductService.updateProductVisible(slug as string);

    return res.status(result.httpCode).json(result);
  }

  @Upload({
    fieldName: 'images',
    maxCount: 10,
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    multiple: true,
    subfolder: 'products',
  })
  @ValidateRequest(UpdateProductDTO)
  public async updateProductBySlug(req: Request, res: Response): Promise<any> {
    try {
      const slug = req.params.slug;
      const input = req.body;
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        const newImagePaths = files.map(
          (file) => `http://localhost:3000/images/products/${file.filename}`,
        );

        const currentProduct = await ProductService.getProductBySlugRaw(slug);
        if (currentProduct) {
          input.images = [...(currentProduct.images || []), ...newImagePaths];
        } else {
          input.images = newImagePaths;
        }
      }

      const result = await ProductService.updateProductBySlug(
        slug as string,
        input,
      );

      return res.status(result.httpCode).json(result);
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(500).json({
        httpCode: 500,
        success: false,
        message: 'PRODUCT.UPDATE.ERROR',
        error: error,
      });
    }
  }

  public async removeProductBySlug(req: Request, res: Response): Promise<any> {
    const slug = req.params.slug;
    const result = await ProductService.removeProductBySlug(slug as string);
    return res.status(result.httpCode).json(result);
  }
}
