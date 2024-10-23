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
  DocumentReference,
  writeBatch,
} from '@angular/fire/firestore';
import { concatMap, from, map, mergeMap, Observable, toArray } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { ProductItemInCart } from '../interfaces/productItemInCart.interface';
import { UserInterface } from '../interfaces/user.interface';
// import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ProductFirebaseService {
  destroyRef = inject(DestroyRef);
  firestore = inject(Firestore);
  productCollection = collection(this.firestore, 'products');
  FavoriteCollection = collection(this.firestore, 'favorite');
  myCartCollection = collection(this.firestore, 'my-cart');
  currentUserCollection = collection(this.firestore, 'current-user');

  // current User 🥸🥸🥸

  addCurrentUser(user: UserInterface) {
    return addDoc(this.currentUserCollection, user);
  }

  // MY FAVORITE Collection 🩷🩷🩷
  getMyFavorite(): Observable<Product[]> {
    return collectionData(this.FavoriteCollection, {}) as Observable<Product[]>;
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
    return from(getDocs(this.FavoriteCollection)).pipe(
      map((snapshot) => {
        return snapshot.docs;
      }),
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

  updateQuantityOfItemInMyCart(
    itemId: string,
    updatedField: Partial<ProductItemInCart>
  ): Observable<void> {
    const itemRef = doc(this.firestore, 'my-cart', itemId);
    const updateData = { ...updatedField };

    return from(updateDoc(itemRef, updateData));
  }

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

  //zzz User favoriteCollection 💛❤️💛❤️💛❤️❤️💛❤️
  addToUserFavorite(userId: string | null, product: Product): Observable<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const userDocRef = doc(this.firestore, 'favorite', userId);
    const subcollectionRef = collection(userDocRef, 'user-favorite');
    const documentRef = doc(subcollectionRef, product.id);

    return from(setDoc(documentRef, product));
  }

  getUserFavoriteList(userId: string | null): Observable<Product[]> {
    const userFavoriteCollection = collection(
      this.firestore,
      `favorite/${userId}/user-favorite`
    );

    return collectionData(userFavoriteCollection) as Observable<Product[]>;
  }

  removeFromUserFavorite(
    userId: string | null,
    productId: string
  ): Observable<void> {
    const userFavoriteCollection = collection(
      this.firestore,
      `favorite/${userId}/user-favorite`
    );
    const documentRef = doc(userFavoriteCollection, productId);

    return from(deleteDoc(documentRef));
  }

  removeAllFromUserFavorite(userId: string): Observable<void> {
    const userFavoriteCollection = collection(
      this.firestore,
      `favorite/${userId}/user-favorite`
    );

    // для избавления от эффекта домино при удаленни карточек
    return from(getDocs(userFavoriteCollection)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => doc.ref)), // Сбор всех ссылок на документы
      concatMap((docs) => {
        const batch = writeBatch(this.firestore); // Создание батча
        docs.forEach((doc) => batch.delete(doc)); // Добавление операций удаления в батч
        return from(batch.commit()); // Коммит батча
      })
    );
  }
}
