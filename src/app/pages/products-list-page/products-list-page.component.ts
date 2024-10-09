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
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [
    TranslateModule,
    SvgIconComponent,
    CommonModule,
    ProductCardComponent,
    PaginationComponent,
  ],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductsListPageComponent implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);

  productsList = signal<Product[]>([]); // Список товаров на сервере
  layoutColumn = signal(true); // Строки или колонки layout
  currentPage = signal(1); // Текущая страница
  itemsPerPage = computed(() => (this.layoutColumn() ? 20 : 8)); // Количество элементов на странице

  // получаем список товаров с сервера Firebase
  ngOnInit(): void {
    this.productsFirebaseService.getProducts().subscribe((res) => {
      this.productsList.set(res);  
    });
  }

  // Вычисляем элементы для отображения в зависимости от текущей страницы
  displayedItems = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    return this.productsList().slice(
      startIndex,
      startIndex + this.itemsPerPage()
    ); 
  }); 

  // слушаем событие от пагинации и обновляем текущую страницу
  onPageChange(page: number) {
    this.currentPage.update(() => page); 
  }

// Переключение layout на кололнки
  toggleLayoutToColumn() {
    this.layoutColumn.set(true); 
  }

  // Переключение layout на строки
  toggleLayoutToRow() {
    this.layoutColumn.set(false); 
  }

  // Возвращает текущее значение layout (строки или колонки)
  isColumnLayout() {
    return this.layoutColumn(); 
  }
}
