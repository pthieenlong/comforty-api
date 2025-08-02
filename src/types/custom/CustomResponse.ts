import { Response } from 'express';
import { ERole } from '../interface/User.type';

export interface Pagination {
  limit: number;
  page: number;
  totalPage: number;
  totalItems?: number;
}

interface CustomResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data?: object & {
    accessToken?: string,
    refreshToken?: string,
    UID?: string, 
    username?: string,
    roles?: ERole[]
  };
  error?: unknown;
  pagination?: Pagination;
}

export default CustomResponse;
