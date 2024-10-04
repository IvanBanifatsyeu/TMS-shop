import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDDn_kO_3PhEIRjdgtkrmHlW7e3rFrM12c',
  authDomain: 'tms-shop-59563.firebaseapp.com',
  projectId: 'tms-shop-59563',
  storageBucket: 'tms-shop-59563.appspot.com',
  messagingSenderId: '248115805872',
  appId: '1:248115805872:web:853f08d9f5ac5f14da4575',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
};
