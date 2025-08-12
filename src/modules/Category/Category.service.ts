import CustomResponse from '@/types/custom/CustomResponse';
import { Category } from './Category.model';
import { v4 as uuidv4 } from 'uuid';
import Utils from '@/utils/utils';
import { UpdateCategoryDTO } from './Category.dto';
import { Product } from '../Product/Product.model';
import { IShortProductResponse } from '@/types/interface/Product.type';

export class CategoryService {
  public static async getCategories(): Promise<CustomResponse> {
    try {
      const categorySchema = await Category.find();
      const results = categorySchema.map((cate) => {
        return {
          name: cate.name,
          slug: cate.slug,
          isVisible: cate.isVisible,
        };
      });
      return {
        httpCode: 200,
        success: true,
        message: 'CATEGORY.GET.SUCCESS',
        data: [...results],
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CATEGORY.GET.FAIL',
      };
    }
  }
  public static async getCategoryBySlug(slug: string): Promise<CustomResponse> {
    try {
      const categorySchema = await Category.findOne({ slug });
      const result = {
        name: categorySchema?.name,
        slug: categorySchema?.slug,
        isVisible: categorySchema?.isVisible,
      };
      return {
        httpCode: 200,
        success: true,
        message: 'CATEGORY.GET.SUCCESS',
        data: result,
      };
    } catch (error) {
      return {
        httpCode: 404,
        success: false,
        message: 'CATEGORY.GET.FAIL',
      };
    }
  }
  public static async createCategory(
    categoryName: string,
  ): Promise<CustomResponse> {
    try {
      const isExist = await Category.findOne({ name: categoryName });
      if (isExist) {
        return {
          httpCode: 409,
          success: false,
          message: 'CATEGORY.CREATE.EXIST',
        };
      }

      const newCategory = new Category({
        _id: uuidv4(),
        name: categoryName,
        slug: Utils.SlugConverter(categoryName),
      });

      const isSuccess = await newCategory.save();

      if (isSuccess)
        return {
          httpCode: 201,
          success: true,
          message: 'CATEGORY.CREATE.SUCCESS',
        };
      else
        return {
          httpCode: 409,
          success: true,
          message: 'CATEGORY.CREATE.FAIL',
        };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'CATEGORY.CREATE.ERROR',
        error,
      };
    }
  }

  public static async updateCategoryBySlug(
    slug: string,
    inputValue: UpdateCategoryDTO,
  ): Promise<CustomResponse> {
    try {
      const category = await Category.findOneAndUpdate(
        { slug },
        {
          ...inputValue,
        },
        { new: true },
      );
      if (!category) {
        return {
          httpCode: 404,
          success: false,
          message: 'CATEGORY.GET.NOT_FOUND',
        };
      }
      return {
        httpCode: 200,
        success: true,
        message: 'CATEGORY.UPDATE.SUCCESS',
      };
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'CATEGORY.UPDATE.CONFLICT',
        error,
      };
    }
  }

  public static async getProductsByCategorySlug(
    slug: string,
  ): Promise<CustomResponse> {
    try {
      const category = await Category.findOne({ slug });
      if (!category) {
        return {
          httpCode: 404,
          success: false,
          message: 'CATEGORY.GET.NOT_FOUND',
        };
      }
      const products = await Product.find({ category: category.slug });
      if (!products) {
        return {
          httpCode: 404,
          success: false,
          message: 'PRODUCT.GET.NOT_FOUND',
        };
      }
      const response: IShortProductResponse[] = products.map((product) => ({
        id: product._id,
        slug: product.slug,
        title: product.title,
        image: product.images[0],
        categories: product.category,
        price: product.price,
        isSale: product.isSale,
        salePercent: product.salePercent,
        rating: product.rating,
        isVisible: product.isVisible,
        createdAt: product.createdAt,
      }));
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.GET.SUCCESS',
        data: response,
      };
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'CATEGORY.GET.CONFLICT',
        error,
      };
    }
  }

  public static async getCategoriesWithProductCount(): Promise<CustomResponse> {
    try {
      const categories = await Category.find().lean();
      const results = await Promise.all(
        categories.map(async (cat) => {
          const count = await Product.countDocuments({
            category: cat.slug,
          });

          return {
            slug: cat.slug,
            name: cat.name,
            productCount: count,
          };
        }),
      );
      return {
        httpCode: 200,
        success: true,
        message: 'CATEGORY.GET.SUCCESS',
        data: results,
      };
    } catch (error) {
      return {
        httpCode: 500,
        success: false,
        message: 'CATEGORY.UPDATE.CONFLICT',
        error,
      };
    }
  }

  public static async removeCategoryBySlug(slug: string) {
    try {
      const category = await Category.findOneAndDelete({ slug });
      if (!category) {
        return {
          httpCode: 404,
          success: false,
          message: 'CATEGORY.DELETE.NOT_FOUND',
        };
      }
      return {
        httpCode: 200,
        success: true,
        message: 'CATEGORY.DELETE.SUCCESS',
      }
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'CATEGORY.DELETE.FAIL',
        error,
      };
    }
  }
}
