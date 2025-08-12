export interface IShortProductResponse {
  id: string;
  slug: string;
  title: string;
  image: string;
  categories: string[];
  price: number;
  rating: number;
  isSale: boolean;
  salePercent: number;
  isVisible: boolean;
  createdAt: Date;
}