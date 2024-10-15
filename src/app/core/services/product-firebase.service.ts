import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductFirebaseService {
  firestore = inject(Firestore);
  productCollection = collection(this.firestore, 'products');

  getProducts(): Observable<Product[]> {
    return collectionData(this.productCollection, {
      idField: 'id',
    }) as Observable<Product[]>;
  }

  addItem(newProduct: Product) {
    return addDoc(this.productCollection, newProduct);
  }

  getMaxPrice (products: Product[]): number {
    return Math.max(...products.map(product => product.price));
  }

  getMinPrice (products: Product[]): number {
    return Math.min(...products.map(product => product.price));
  }
}
