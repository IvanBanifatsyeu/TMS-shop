import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { Product } from '../../core/interfaces/product.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CategoryCardComponent,
    CommonModule,
    TranslateModule,
    ProductCardComponent,
    RouterModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  categoryService: CategoryService = inject(CategoryService);
  categoryList = this.categoryService.categoryList;
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  featuredProducts: Product[] | null = null;
  latestProducts: Product[] | null = null;
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.productsFirebaseService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const sortedByRate = res.sort((a, b) => {
          return b.rating - a.rating;
        });
        this.featuredProducts = sortedByRate.slice(0, 4);

        const sortedByDate = res.sort((a, b) => {
          const [dayA, monthA, yearA] = a.addedAt.split('.');
          const [dayB, monthB, yearB] = b.addedAt.split('.');

          const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
          const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

          return dateB.getTime() - dateA.getTime();
        });
        this.latestProducts = sortedByDate.slice(0, 8);
      });
  }
}
