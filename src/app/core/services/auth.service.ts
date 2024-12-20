import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  currentUser_s = signal<UserInterface | null | undefined>(undefined);

  getCurrentUser$() {
    return user(this.firebaseAuth);
  }

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then((response) => {
        // Обновляем профиль с указанием displayName
        return updateProfile(response.user, { displayName: username })
          .then(() => {
            // После обновления профиля вызываем reload(), чтобы убедиться, что обновления сохранены
            return response.user.reload();
          })
          .catch((error) => {
            console.error('Error updating profile:', error);
            throw error;
          });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        throw error;
      });

    // Возвращаем Observable, который завершится, когда все асинхронные операции завершены
    return from(promise);
  }

  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  loadUser(): Observable<void> {
    return this.getCurrentUser$().pipe(
      switchMap((firebaseUser: User | null) => {
        if (firebaseUser) {
          this.currentUser_s.set({
            email: firebaseUser.email ?? '',
            username: firebaseUser.displayName ?? '',
            userId: firebaseUser.uid,
          });
          return of(undefined); // Возвращаем успешный результат
        } else {
          this.currentUser_s.set(null);
          return of(undefined); // Возвращаем успешный результат
        }
      }),
      catchError((error) => {
        console.error('Error loading user:', error);
        this.currentUser_s.set(null);
        return of(undefined); // Возвращаем успешный результат даже при ошибке
      })
    );
  }
}
