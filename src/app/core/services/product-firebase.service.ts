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
  writeBatch,
} from '@angular/fire/firestore';
import { concatMap, from, map, mergeMap, Observable, toArray } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { ProductItemInCart } from '../interfaces/productItemInCart.interface';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductFirebaseService {
  destroyRef = inject(DestroyRef);
  firestore = inject(Firestore);
  productCollection = collection(this.firestore, 'products');
  FavoriteCollection = collection(this.firestore, 'favorite');
  CartCollection = collection(this.firestore, 'cart');
  currentUserCollection = collection(this.firestore, 'current-user');

  // User CART Collection 🛒🛒💲💲💰💰
  getItemsFromUserCart(userId: string | null): Observable<ProductItemInCart[]> {
    const userDocRef = doc(this.firestore, 'cart', userId!); // Ссылка на документ пользователя (по userId)
    const subcollectionRef = collection(userDocRef, 'user-cart'); // Ссылка на подколлекцию 'user-cart'

    return collectionData(subcollectionRef) as Observable<ProductItemInCart[]>;
  }

  addItemToUserCart(
    userId: string | null,
    productToCart: ProductItemInCart
  ): Observable<ProductItemInCart> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const userDocRef = doc(this.firestore, 'cart', userId); // get ref (apply userId) to user object
    const subcollectionRef = collection(userDocRef, 'user-cart'); // get ref  to subcollection user-cart
    const itemRef = doc(subcollectionRef); // get ref to item object from subcollection user-cart
    const itemId = itemRef.id; // get item id
    const data = {
      ...productToCart,
      id: itemId,
    }; // add item id to item object

    return from(setDoc(itemRef, data)).pipe(
      map(() => data as ProductItemInCart)
    );
  }

  removeFromUserCart(userId: string | null, id: string): Observable<void> {
    const docRef = doc(this.firestore, `cart/${userId}/user-cart/${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  updateQuantityOfItemInUserCart(
    userId: string | null,
    itemId: string,
    updatedField: Partial<ProductItemInCart>
  ): Observable<void> {
    // const itemRef = doc(this.firestore, 'cart', itemId);
    const itemRef = doc(this.firestore, `cart/${userId}/user-cart/${itemId}`);
    const updateData = { ...updatedField };

    return from(updateDoc(itemRef, updateData));
  }

  removeAllFromUserCart(userId: string | null): Observable<void> {
    const userDocRef = doc(this.firestore, 'cart', userId!); // Ссылка на документ пользователя (по userId)
    const subcollectionRef = collection(userDocRef, 'user-cart'); // Ссылка на подколлекцию 'user-cart'

    return from(getDocs(subcollectionRef)).pipe(
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

  // User favoriteCollection 💛❤️💛❤️💛❤️❤️💛❤️
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
