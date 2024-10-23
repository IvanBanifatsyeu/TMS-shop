import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { appInitializerFactory } from './core/initializers/appInitializer';
import { AuthService } from './core/services/auth.service';

const firebaseConfig = {
  apiKey: 'AIzaSyDDn_kO_3PhEIRjdgtkrmHlW7e3rFrM12c',
  authDomain: 'tms-shop-59563.firebaseapp.com',
  projectId: 'tms-shop-59563',
  storageBucket: 'tms-shop-59563.appspot.com',
  messagingSenderId: '248115805872',
  appId: '1:248115805872:web:853f08d9f5ac5f14da4575',
};

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideHttpClient(),
    provideFirestore(() => getFirestore()),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ]),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory, 
      deps: [AuthService], 
      multi: true, 
    },
  ],
};
