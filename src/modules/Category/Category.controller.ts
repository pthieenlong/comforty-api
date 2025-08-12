import { Request, Response } from "express";
import { ValidateRequest } from "@/common/decorators/validation.decorator";
import CustomResponse from "@/types/custom/CustomResponse";
import { configModule } from "@/common/config/config.module";
import CustomRequest from "@/types/custom/CustomRequest";
import { CategoryService } from "./Category.service";
import { CategoryDTO, UpdateCategoryDTO } from "./Category.dto";
export default class CategoryController {
  public async getCategories(
    req: Request,
    res: Response,
  ): Promise<any> {
    const categories = await CategoryService.getCategories();
    return res.json(categories);
  }

  @ValidateRequest(CategoryDTO)
  public async createCategory(req: Request, res: Response): Promise<any> {
    const categoryName = req.body.name;
    const result = await CategoryService.createCategory(categoryName);

    return res.status(result.httpCode).json(result);
  }

  @ValidateRequest(UpdateCategoryDTO)
  public async updateCategoryBySlug(req: Request, res: Response): Promise<any> {
    const { slug } = req.params;
    const input = req.body;
    const result = await CategoryService.updateCategoryBySlug(slug, input);

    return res.status(result.httpCode).json(result);
  }

  public async getProductsByCategorySlug(req: Request, res: Response): Promise<any> {
    const { slug } = req.params;
    const result = await CategoryService.getProductsByCategorySlug(slug);

    return res.status(result.httpCode).json(result);
  }
  public async getCategoriesWithProductCount(req: Request, res: Response): Promise<any> {
    const result = await CategoryService.getCategoriesWithProductCount();
    return res.status(result.httpCode).json(result);
  }
  public async removeCategoryBySlug(req: Request, res: Response): Promise<any> {
    const slug = req.params.slug;
    const result = await CategoryService.removeCategoryBySlug(slug as string);
    return res.status(result.httpCode).json(result);
  }
}