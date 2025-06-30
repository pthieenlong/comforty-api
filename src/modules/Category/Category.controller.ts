import { Request, Response } from "express";
import { ValidateRequest } from "@/common/decorators/validation.decorator";
import CustomResponse from "@/types/custom/CustomResponse";
import { configModule } from "@/common/config/config.module";
import CustomRequest from "@/types/custom/CustomRequest";
import { CategoryService } from "./Category.service";
import { CategoryDTO } from "./Category.dto";
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
}