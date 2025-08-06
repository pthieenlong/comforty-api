import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsBoolean()
  isSale: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible: boolean;

  @IsOptional()
  @IsNumber()
  salePercent: number;

  @IsOptional()
  @IsString()
  shortDesc: string;

  @IsOptional()
  @IsString()
  longDesc: string;
}
