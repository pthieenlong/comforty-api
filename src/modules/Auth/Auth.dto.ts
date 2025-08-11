import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';
import { Match } from '@decorators/match.decorator';

export class RegisterDTO {
  @IsString()
  @MinLength(8)
  username: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsString()
  @Match('password', {
    message: 'Password is not match',
  })
  confirmPassword: string;

  @IsEmail()
  email: string;
}

export class LoginDTO {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class ResendVerificationDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;

  @IsString()
  @Match('newPassword', {
    message: 'Password confirmation does not match',
  })
  confirmPassword: string;
}

export class UpdatePasswordDTO {
  @IsString()
  oldPassword: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;

  @IsString()
  @Match('newPassword', {
    message: 'Password confirmation does not match',
  })
  confirmPassword: string;
}
