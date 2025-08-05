export enum CartStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPING = 'SHIPPING',
  COMPLETED = "COMPLETED"
}

export interface ICartItem {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  isSale: boolean;
  salePercent: number;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
}
