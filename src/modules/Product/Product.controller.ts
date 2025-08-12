import { ValidateRequest } from '@/common/decorators/validation.decorator';
import ProductService from './Product.service';
import { Request, Response } from 'express';
import { CreateProductDTO, UpdateProductDTO } from './Product.dto';
export default class ProductController {
  public async getProductBySlug(req: Request, res: Response): Promise<any> {
    const slug = req.params.slug;
    const product = await ProductService.getProductBySlug(slug);

    return res.status(product.httpCode).json(product);
  }

  @ValidateRequest(CreateProductDTO)
  public async createProduct(req: Request, res: Response): Promise<any> {
    const productInput = req.body;
    const result = await ProductService.createProduct(productInput);

    return res.status(result.httpCode).json(result);
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

  @ValidateRequest(UpdateProductDTO)
  public async updateProductBySlug(req: Request, res: Response): Promise<any> {
    const slug = req.params.slug;
    const input = req.body;

    const result = await ProductService.updateProductBySlug(
      slug as string,
      input,
    );

    return res.status(result.httpCode).json(result);
  }

  public async removeProductBySlug(req: Request, res: Response): Promise<any> {
    const slug = req.params.slug;
    const result = await ProductService.removeProductBySlug(slug as string);
    return res.status(result.httpCode).json(result);    
  }
}
