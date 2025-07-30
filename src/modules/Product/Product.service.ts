import CustomResponse from '@/types/custom/CustomResponse';
import { CreateProductDTO } from './Product.dto';
import Utils from '@/utils/utils';
import { Product } from './Product.model';
import { v4 as uuidv4 } from 'uuid';

export default class ProductService {
  public static async getProductBySlug(slug: string): Promise<CustomResponse> {
    try {
      const product = await Product.findOne({ slug });
      if (!product) {
        return {
          httpCode: 404,
          success: false,
          message: 'PRODUCT.GET.NOT_FOUND',
        };
      }
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.GET.SUCCESS',
        data: product,
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.GET.FAIL',
      };
    }
  }

  public static async getAllProductsWithCategorySlug(
    categorySlug: string,
  ): Promise<CustomResponse> {
    try {
      const products = await Product.find().populate({
        path: 'category',
        model: 'Category',
        localField: 'category',
        foreignField: categorySlug,
        justOne: true,
      });
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.GET.SUCCESS',
        data: products,
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.GET.FAIL',
      };
    }
  }

  public static async createProduct(
    productInput: CreateProductDTO,
  ): Promise<CustomResponse> {
    try {
      const slug = Utils.SlugConverter(productInput.name);
      const isExist = await Product.findOne({ slug });
      if (isExist) {
        return {
          httpCode: 409,
          success: false,
          message: 'PRODUCT.CREATE.EXIST',
        };
      }

      const product = new Product({
        _id: uuidv4(),
        slug,
        ...productInput,
      });
      const isSuccess = await product.save();

      if (isSuccess) {
        return {
          httpCode: 201,
          success: true,
          message: 'PRODUCT.CREATE.SUCCESS',
        };
      }

      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.CREATE.FAIL',
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.CREATE.FAIL',
      };
    }
  }

  public static async getBestProducts(): Promise<CustomResponse> {
    try {
      const products = await Product.find().sort({ rating: -1 }).limit(4);
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.GET.SUCCESS',
        data: products,
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.GET.FAIL',
        error,
      };
    }
  }

  public static async getProductsByLimit(
    limit: string,
  ): Promise<CustomResponse> {
    try {
      const products = await Product.find().limit(parseInt(limit));
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.GET.SUCCESS',
        data: products,
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.GET.FAIL',
      };
    }
  }

  public static async getNewProducts(limit: string): Promise<CustomResponse> {
    try {
      const products = await Product.find()
        .sort({
          createdAt: -1,
          updatedAt: -1,
        })
        .limit(parseInt(limit));
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.GET.SUCCESS',
        data: products,
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.GET.FAIL',
      };
    }
  }

  public static async getAllProducts(
    page = 1,
    limit = 9,
  ): Promise<CustomResponse> {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalItems = await Product.countDocuments();
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCTS.GET.SUCCESS',
        data: [...products],
        pagination: {
          limit,
          page,
          totalPage: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      return {
        httpCode: 409,
        message: 'PRODUCTS.GET.CONFLICT',
        success: false,
        error,
      };
    }
  }

  public static async getSearchProducts(
    query: string,
  ): Promise<CustomResponse> {
    try {
      const $regex = new RegExp(query, 'i');
      const products = await Product.find({ name: $regex });
      console.log(products);

      if (products.length < 0) {
        return {
          httpCode: 404,
          message: 'PRODUCTS.GET.SUCCESS',
          success: true,
          data: [],
        };
      } else
        return {
          httpCode: 200,
          message: 'PRODUCTS.GET.SUCCESS',
          success: true,
          data: products,
        };
    } catch (error) {
      return {
        httpCode: 409,
        message: 'PRODUCTS.GET.CONFLICT',
        success: false,
        error,
      };
    }
  }
}
