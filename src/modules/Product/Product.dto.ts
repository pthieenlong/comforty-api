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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @IsOptional()
  @IsBoolean()
  isVisible: boolean;
}
