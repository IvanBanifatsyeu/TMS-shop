import { Routes } from '@angular/router';
import {  HomePageComponent } from './pages/home-page/home-page.component';
import { ProductsListPageComponent } from './pages/products-list-page/products-list-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'shop', component: ProductsListPageComponent },

];
