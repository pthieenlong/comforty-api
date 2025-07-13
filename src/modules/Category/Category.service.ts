import CustomResponse from '@/types/custom/CustomResponse';
import { Category } from "./Category.model";
import { v4 as uuidv4 } from 'uuid'
import Utils from '@/utils/utils';

export class CategoryService {
  public static async getCategories(): Promise<CustomResponse> {
    try {
      const categorySchema = await Category.find();
      const results = categorySchema.map((cate) => {
        return {
          name: cate.name,
          slug: cate.slug
        }
      });
      return {
        httpCode: 200,
        success: true,
        message: "CATEGORY.GET.SUCCESS",
        data: [...results]
      }
    } 
    catch(error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CATEGORY.GET.FAIL',
      };
    }
  }
  public static async createCategory(categoryName: string): Promise<CustomResponse> {
    try {
      const isExist = await Category.findOne({ name: categoryName });
      if(isExist) {
        return {
          httpCode: 409,
          success: false,
          message: "CATEGORY.CREATE.EXIST"
        };
      }

      const newCategory = new Category({
        _id: uuidv4(),
        name: categoryName,
        slug: Utils.SlugConverter(categoryName)
      })

      const isSuccess = await newCategory.save();

      if(isSuccess) 
        return {
          httpCode: 201,
          success: true,
          message: "CATEGORY.CREATE.SUCCESS"
        }
      else 
        return {
          httpCode: 409,
          success: true,
          message: "CATEGORY.CREATE.FAIL"
        }
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'CATEGORY.CREATE.ERROR',
        error
      }
    }
  }
}