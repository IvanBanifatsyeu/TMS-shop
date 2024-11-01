import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product.interface';
import { ProductItemInCart } from '../interfaces/productItemInCart.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  listUserFavorite_s = signal<Product[] | null>(null);
  listUserCart_s = signal<ProductItemInCart[] | null>(null);
}
