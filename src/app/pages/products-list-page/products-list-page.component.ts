import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { CommonModule } from '@angular/common';
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { Product } from '../../core/interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [
    TranslateModule,
    SvgIconComponent,
    CommonModule,
    ProductCardComponent,
  ],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListPageComponent implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);

  productsListAll = signal<Product[]>([]); // Список всех продуктов
  layoutColumn = signal(true); // Строки или колонки layout
  currentPage = signal(1);
  itemsPerPage = computed(() => (this.layoutColumn() ? 20 : 8));

  ngOnInit(): void {
    this.productsFirebaseService.getProducts().subscribe((res) => {
      this.productsListAll.set(res);
    });
    console.log('productsListAll', this.productsListAll());
  }

  toggleLayoutToColumn() {
    this.layoutColumn.set(true); // Переключение layout на кололнки
  }

  toggleLayoutToRow() {
    this.layoutColumn.set(false); // Переключение layout на строки
  }

  isColumnLayout() {
    return this.layoutColumn(); // Возвращает текущее значение layout (строки или колонки)
  }

  totalPages = () => {
    return Math.ceil(this.productsListAll().length / this.itemsPerPage());
  };

  pagesArray = () => Array.from({ length: this.totalPages() }, (_, i) => i + 1);

  // Функция для получения элементов для текущей страницы
  paginatedItems = () => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    return this.productsListAll().slice(
      startIndex,
      startIndex + this.itemsPerPage()
    );
  };

  // Переход к следующей странице
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  // Переход к предыдущей странице
  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

   // Переход к конкретной странице
   goToPage(page: number) {
    this.currentPage.set(page);
  }
}
