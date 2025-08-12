import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CategoryDTO {
  @IsString()
  name: string
}

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  name: string

  @IsBoolean()
  @IsOptional()
  isVisible: boolean
}