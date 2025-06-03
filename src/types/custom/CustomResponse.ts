export interface Pagination {
  limit: number;
  page: number;
  totalPage: number;
  totalItems?: number;
}

export default interface CustomResponse<T = object> {
  httpCode: number;
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
}