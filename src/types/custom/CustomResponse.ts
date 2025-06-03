import { Response } from "express";

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
  data?: object;
  pagination?: Pagination;
}

export default CustomResponse