import { ValidateRequest } from "@/common/decorators/validation.decorator";
import ProductService from "./Product.service";
import { Request, Response } from "express";
import { CreateProductDTO } from "./Product.dto";
export default class ProductController {
  public async getProductBySlug(
    req: Request,
    res: Response
  ):Promise<any> {
    const slug = req.params.slug;
    const product = await ProductService.getProductBySlug(slug);

    return res.status(product.httpCode).json(product);
  }

  @ValidateRequest(CreateProductDTO)
  public async createProduct(
    req: Request,
    res: Response
  ):Promise<any> {
    const productInput = req.body;
    const result = await ProductService.createProduct(productInput);

    return res.status(result.httpCode).json(result);
  }

  public async getAllProductsWithCategorySlug( 
    req: Request,
    res: Response
  ):Promise<any> {
    const categorySlug = req.query;
    console.log(categorySlug);
    return res.status(200)
  }

  public async getAllProducts(
    req: Request,
    res: Response
  ) {

  }
}