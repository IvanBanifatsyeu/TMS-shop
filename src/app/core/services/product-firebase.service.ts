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
  updateDoc,
} from '@angular/fire/firestore';
import {
  catchError,
  concatMap,
  delay,
  from,
  map,
  mergeMap,
  Observable,
  of,
  tap,
  throwError,
  toArray,
} from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { ProductItemInCart } from '../interfaces/productItemInCart.interface';
// import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ProductFirebaseService {
  destroyRef = inject(DestroyRef);
  firestore = inject(Firestore);
  productCollection = collection(this.firestore, 'products');
  myFavoriteCollection = collection(this.firestore, 'my-favorite');
  myCartCollection = collection(this.firestore, 'my-cart');

  // MY FAVORITE Collection 🩷🩷🩷
  getMyFavorite(): Observable<Product[]> {
    return collectionData(this.myFavoriteCollection, {}) as Observable<
      Product[]
    >;
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
    return from(getDocs(this.myFavoriteCollection)).pipe(
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
    return collectionData(this.myCartCollection) as Observable<
      ProductItemInCart[]
    >;
  }

  addItemToMyCart(
    productToCart: ProductItemInCart
  ): Observable<ProductItemInCart> {
    const itemRef = doc(collection(this.firestore, 'my-cart'));
    const itemId = itemRef.id;
    const data = {
      ...productToCart,
      id: itemId,
    };

    return from(setDoc(itemRef, data)).pipe(
      map(() => data as ProductItemInCart)
    );
  }

  // zzz
  updateQuantityOfItemInMyCart(
    itemId: string,
    updatedField: Partial<ProductItemInCart>
  ): Observable<void> {
    const itemRef = doc(this.firestore, 'my-cart', itemId);

    // Create an object with only the field you want to update
    const updateData = { ...updatedField };

    return from(updateDoc(itemRef, updateData)).pipe(
      map(() => {
        // Optionally, you can return the updated data here if needed
        // You'd need to fetch the updated document from Firestore
        // to get the full updated data.
        console.log(`Item with ID ${itemId} updated successfully!`);
      })
    );
  }

  //zzz

  removeFromMyCart(id: string): Observable<void> {
    const docRef = doc(this.firestore, `my-cart/${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  removeAllFromMyCart(): Observable<void> {
    return from(getDocs(this.myCartCollection)).pipe(
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
