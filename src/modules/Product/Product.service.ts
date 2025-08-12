import CustomResponse from '@/types/custom/CustomResponse';
import { CreateProductDTO, UpdateProductDTO } from './Product.dto';
import Utils from '@/utils/utils';
import { Product } from './Product.model';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../Category/Category.model';
import { IShortProductResponse } from '@/types/interface/Product.type';

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
    console.log(categorySlug);
    
    try {
      const products = await Product.find({ category: categorySlug });
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
      const slug = Utils.SlugConverter(productInput.title);
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
      const products = await Product.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: 'slug',
            as: 'categoryDetails',
          },
        },
        {
          $addFields: {
            categoryNames: '$categoryDetails.name',
          },
        },
        {
          $project: {
            categoryDetails: 0,
          },
        },
        {
          $sort: { rating: -1 },
        },
        {
          $limit: 8,
        },
      ]);
      const response: IShortProductResponse[] = products.map((product) => ({
        id: product._id,
        slug: product.slug,
        title: product.title,
        image: product.images[0],
        categories: product.categoryNames,
        price: product.price,
        isSale: product.isSale,rating: product.rating,
        salePercent: product.salePercent,
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
      const products = await Product.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: 'slug',
            as: 'categoryDetails',
          },
        },
        {
          $addFields: {
            categoryNames: '$categoryDetails.name',
          },
        },
        {
          $project: {
            categoryDetails: 0,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 8,
        },
      ]);
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
        httpCode: 409,
        success: false,
        message: 'PRODUCT.GET.FAIL',
      };
    }
  }

  public static async getNewProducts(limit: string): Promise<CustomResponse> {
    try {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: 'slug',
            as: 'categoryDetails',
          },
        },
        {
          $addFields: {
            categoryNames: '$categoryDetails.name',
          },
        },
        {
          $project: {
            categoryDetails: 0,
          },
        },
        {
          $sort: { createdAt: -1, updateAt: -1 },
        },
        {
          $limit: 8,
        },
      ]);
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
        httpCode: 409,
        success: false,
        message: 'PRODUCT.GET.FAIL',
      };
    }
  }

  public static async getSaleProducts(): Promise<CustomResponse> {
    try {
      const products = await Product.aggregate([
        {
          $match: {
            isSale: true,
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: 'slug',
            as: 'categoryDetails',
          },
        },
        {
          $addFields: {
            categoryNames: '$categoryDetails.name',
          },
        },
        {
          $project: {
            categoryDetails: 0,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 8,
        },
      ]);
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
        httpCode: 409,
        success: false,
        message: 'PRODUCT.GET.FAIL',
      };
    }
  }

  public static async getAllProducts(
    page = 1,
    limit = 12,
  ): Promise<CustomResponse> {
    try {
      const products = await Product.find().sort({ rating: -1 }).populate({
        path: 'category',
        model: 'Category',
        select: 'name',
      });
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
        message: 'PRODUCTS.GET.SUCCESS',
        data: [...response],
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
      const products = await Product.find({ title: $regex });
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
  public static async updateProductBySlug(
    slug: string,
    productInput: Partial<UpdateProductDTO>,
  ): Promise<CustomResponse> {
    try {
      const product = await Product.findOneAndUpdate(
        { slug },
        {
          ...productInput,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!product) {
        return {
          httpCode: 404,
          success: false,
          message: 'PRODUCT.GET.FAIL',
        };
      }
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.UPDATE.SUCCESS',
        data: product,
      };
    } catch (error) {
      console.log(error);
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.UPDATE.FAIL',
        error,
      };
    }
  }
  public static async updateProductSale(slug: string): Promise<CustomResponse> {
    try {
      const product = await Product.findOneAndUpdate(
        { slug },
        [{ $set: { isSale: { $not: '$isSale' } } }],
        { new: true },
      );
      if (!product) {
        return {
          httpCode: 404,
          success: false,
          message: 'PRODUCT.GET.FAIL',
        };
      }

      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.UPDATE.SUCCCESS',
        data: product,
      };
    } catch (error) {
      console.log(error);

      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.UPDATE.FAIL',
        error,
      };
    }
  }
  public static async updateProductVisible(slug: string) {
    try {
      const product = await Product.findOneAndUpdate(
        { slug },
        [{ $set: { isVisible: { $not: '$isVisible' } } }],
        { new: true },
      );
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
        message: 'PRODUCT.UPDATE.SUCCCESS',
        data: product,
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.UPDATE.FAIL',
        error,
      };
    }
  }

  public static async removeProductBySlug(slug: string) {
    try {
      const product = await Product.findOneAndDelete({ slug });
      if(!product) {
        return {
          httpCode: 404,
          success: false,
          message: 'PRODUCT.DELETE.NOT_FOUND',
        };
      } 
      return {
        httpCode: 200,
        success: true,
        message: 'PRODUCT.DELETE.SUCCESS',
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: 'PRODUCT.DELETE.FAIL',
        error,
      };
    }
  }
}
