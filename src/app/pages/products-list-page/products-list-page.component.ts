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
import { ITEM_FOR_PAGE_COLUMN_LAYOUT, ITEM_FOR_PAGE_ROW_LAYOUT } from '../../core/constants/ui-constants';

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

  productsList = signal<Product[]>([]); // List of products on server
  layoutColumn = signal(true); // selected layout (rows or columns)
  currentPage = signal(1); 
  itemsPerPage = computed(() => (this.layoutColumn() ? ITEM_FOR_PAGE_COLUMN_LAYOUT : ITEM_FOR_PAGE_ROW_LAYOUT)); 

  // getting a list of products from Firebase
  ngOnInit(): void {
    this.productsFirebaseService.getProducts().subscribe((res) => {
      this.productsList.set(res);  
    });
  }

  // calculate the elements to display depending on selected page number
  displayedItems = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    return this.productsList().slice(
      startIndex,
      startIndex + this.itemsPerPage()
    ); 
  }); 

  // istening to pagination event and updating current page
  onPageChange(page: number) {
     this.currentPage.set(page) 
  }

// Switching layout to column
  toggleLayoutToColumn() {
    this.layoutColumn.set(true); 
  }

  // Switching layout to row
  toggleLayoutToRow() {
    this.layoutColumn.set(false); 
  }

  // Returns true if layout is column
  isColumnLayout() {
    return this.layoutColumn(); 
  }
}
