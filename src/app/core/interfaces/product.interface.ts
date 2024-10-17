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
  quantity?: { color: string; size: string }[];
}