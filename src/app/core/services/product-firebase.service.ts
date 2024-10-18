import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from '@angular/fire/firestore';
import { from, map, mergeMap, Observable, toArray } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { ProductItemInCart } from '../interfaces/productItemInCart.interface';
import { v4 as uuidv4 }  from 'uuid'; 

@Injectable({
  providedIn: 'root',
})
export class ProductFirebaseService {
  destroyRef = inject(DestroyRef);
  firestore = inject(Firestore);
  productCollection = collection(this.firestore, 'products');
  myFavorite = collection(this.firestore, 'my-favorite');
  myCart = collection(this.firestore, 'my-cart');

  // MY FAVORITE Collection 🩷🩷🩷
  getMyFavorite(): Observable<Product[]> {
    return collectionData(this.myFavorite, {}) as Observable<Product[]>;
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

  removeAllFromMyFavorite(): Observable<void> {
    return from(getDocs(this.myFavorite)).pipe(
      map((snapshot) => snapshot.docs),
      mergeMap((docs) =>
        from(docs).pipe(
          mergeMap((doc) => from(deleteDoc(doc.ref))),
          toArray()
        )
      ),
      map(() => {})
    );
  }

  // MY CART Collection 🛒🛒💲💲💰💰
  getItemsFromMyCart(): Observable<ProductItemInCart[]> {
    return collectionData(this.myCart) as Observable<ProductItemInCart[]>;
  }

  addItemToMyCart(
    productToCart: ProductItemInCart
  ): Observable<ProductItemInCart> {

    
    const cartItemId = uuidv4();
    const cartItemRef = doc(this.myCart, cartItemId);
    const data = {
      ...productToCart,
      orderId: cartItemId,
    };

    return from(setDoc(cartItemRef, data)).pipe(
      map(() => data as ProductItemInCart)
    );
  }

  removeFromMyCart(id: string): Observable<void> {
    const docRef = doc(this.firestore, `my-cart/${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  // updateArrItemsInCart(
  //   id: string,
  //   dataToUpdate: OrderedSpecificFields[]
  // ): Observable<void> {
  //   const docRef = doc(this.firestore, `my-cart/${id}`);
  //   const promise = setDoc(docRef, { arrItemsInCart: dataToUpdate });
  //   return from(promise);
  // }

  //  PRODUCT Collection 👚👚👚
  getProducts(): Observable<Product[]> {
    return collectionData(this.productCollection, {
      idField: 'id',
    }) as Observable<Product[]>;
  }

  addItem(newProduct: Product) {
    return addDoc(this.productCollection, newProduct);
  }

  getMaxPrice(products: Product[]): number {
    return Math.max(...products.map((product) => product.price));
  }

  getMinPrice(products: Product[]): number {
    return Math.min(...products.map((product) => product.price));
  }
}
