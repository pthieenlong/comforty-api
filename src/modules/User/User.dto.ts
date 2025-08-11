import { IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UserUpdateDTO {
  @IsString()
  @IsOptional()
  fullname: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  avatar: string;
}