import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';


@Injectable({
  providedIn: 'root',
})
export class ProductFirebaseService {
  firestore = inject(Firestore);
  productCollection = collection(this.firestore, 'products');
  myFavorite = collection(this.firestore, 'my-favorite');

  getMyFavorite(): Observable<Product[]> {
    return collectionData(this.myFavorite, {
    }) as Observable<Product[]>;
  }

  addItemToMyFavorite(product: Product) {
    const docRef = doc(this.firestore, 'my-favorite', product.id);
    return setDoc(docRef, product);
      
  }

  removeFromMyFavorite(id: string): Observable<void> {
    const docRef = doc(this.firestore, `my-favorite/${id}`);
      const promise = deleteDoc(docRef);
      return from(promise);
    
  }

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
