export enum ERole {
  ADMIN = "ADMIN",
  USER = "USER",
} 

export enum EVerify {
  UNVERIFIED = 0,
  VERIFIED = 1
}

export interface IRegisterInput {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}