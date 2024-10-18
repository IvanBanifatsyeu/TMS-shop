export interface Product {
  category: string;
  model: string;
  price: number;
  description: string;
  rating: number;
  color: string[];
  id: string;
  imgUrl: string;
  addedAt: string;
  sizes: string[];
  curColor: string;
  arrItemsInCart?: { color: string; size: string }[];
}