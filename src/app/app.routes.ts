import { Routes } from '@angular/router';
import {  HomePageComponent } from './pages/home-page/home-page.component';
import { ProductsListPageComponent } from './pages/products-list-page/products-list-page.component';
import { ProductDescriptionPageComponen } from './pages/product-description-page/product-description-page.component';
import { MyFavoriteComponent } from './pages/my-favorite/my-favorite.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  { path: 'shop', component: ProductsListPageComponent },
  {
    path: 'shop/:id',
    component: ProductDescriptionPageComponen,
  },
  { path: 'my-favorite', component: MyFavoriteComponent },
  { path: 'auth', component: AuthComponent },
];
