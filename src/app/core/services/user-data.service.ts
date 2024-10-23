import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  AuthService = inject(AuthService);
  currentUser = computed(() => {
    return this.AuthService.currentUser_s();
  });
  listUserFavorite_s = signal<Product[] | null>(null);

  

  
}
