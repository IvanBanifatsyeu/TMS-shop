export interface Product {
    category: string;
    model: string;
    price: number;
    description: string;
    rating: number;
    color: string[];
    idField?: string;
    imgUrl: string;
}
