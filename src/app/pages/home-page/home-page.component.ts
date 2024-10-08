import { Component, inject } from '@angular/core';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { Product } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CategoryCardComponent,
    CommonModule,
    TranslateModule,
    ProductCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  categoryService: CategoryService = inject(CategoryService);
  categoryList = this.categoryService.categoryList;
  translate = inject(TranslateService);

  productsFirebaseService = inject(ProductFirebaseService);
  featuredProducts: Product[] | null = null;

  constructor() {
    this.productsFirebaseService.getProducts().subscribe((res) => {
      res.map((item) => {
        console.log(item.sizes);
      });

      const sortedByRate = res.sort((a, b) => {
        return b.rating - a.rating;
      });

      this.featuredProducts = sortedByRate.slice(0, 4);
    });
  }

  // logData(value: any) {
  //   console.log('Введено значение:', value);
  // }
}
