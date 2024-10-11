import { Routes } from '@angular/router';
import {  HomePageComponent } from './pages/home-page/home-page.component';
import { ProductsListPageComponent } from './pages/products-list-page/products-list-page.component';
import { ProductDescriptionPageComponen } from './pages/product-description-page/product-description-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'shop', component: ProductsListPageComponent },
    { path: 'shop/:id', component: ProductDescriptionPageComponen },
];
