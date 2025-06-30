import CustomResponse from "@/types/custom/CustomResponse";
import { CreateProductDTO } from "./Product.dto";
import Utils from "@/utils/utils";
import { Product } from "./Product.model";
import { v4 as uuidv4 } from 'uuid'

export default class ProductService {
  public static async getProductBySlug(slug: string) : Promise<CustomResponse> {
    try {
      const product = await Product.findOne({ slug });
      if(!product) {
        return {
          httpCode: 404,
          success: false,
          message: "PRODUCT.GET.FAIL"
        };
      }
      return {
        httpCode: 200,
        success: true,
        message: "PRODUCT.GET.SUCCESS",
        data: product
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: "PRODUCT.GET.FAIL"
      };
    }
  }

  public static async getAllProductsWithCategorySlug(categorySlug: string) : Promise<CustomResponse> {
    try {
      const products = await Product.find().populate({
        path: 'category',
        model: 'Category',
        localField: 'category',
        foreignField: 'slug',
        justOne: true
      })
      console.log(products);
      return {
        httpCode: 200,
        success: true,
        message: "PRODUCT.GET.SUCCESS"
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: "PRODUCT.GET.FAIL"
      };
    }
  }
  
  public static async createProduct(productInput: CreateProductDTO) : Promise<CustomResponse> {
    try {
      const slug = Utils.SlugConverter(productInput.name);
      const isExist = await Product.findOne({ slug });
      if(isExist) {
        return {
          httpCode: 409,
          success: false,
          message: "PRODUCT.CREATE.EXIST"
        };
      }

      const product = new Product({
        _id: uuidv4(),
        slug,
        ...productInput
      })
      const isSuccess = await product.save();

      if(isSuccess) {
        return {
          httpCode: 201,
          success: true,
          message: "PRODUCT.CREATE.SUCCESS"
        };
      }

      return {
        httpCode: 409,
        success: false,
        message: "PRODUCT.CREATE.FAIL"
      };
    } catch (error) {
      return {
        httpCode: 409,
        success: false,
        message: "PRODUCT.CREATE.FAIL"
      };
    }
  }
}