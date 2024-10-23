import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  user,
} from '@angular/fire/auth';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);

  currentUser_s = signal<UserInterface | null | undefined>(undefined);

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, { displayName: username })
    );
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  loadUser(): Observable<void> {
    return this.user$.pipe(
      switchMap((firebaseUser : User ) => {
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
