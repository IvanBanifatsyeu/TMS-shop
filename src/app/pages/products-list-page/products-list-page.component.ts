import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
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
import {
  ITEM_FOR_PAGE_COLUMN_LAYOUT,
  ITEM_FOR_PAGE_ROW_LAYOUT,
} from '../../core/constants/ui-constants';
import { LogPipe } from '../../shared/pipes/log.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [
    TranslateModule,
    SvgIconComponent,
    CommonModule,
    ProductCardComponent,
    PaginationComponent,
    LogPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListPageComponent implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  filteredData = signal<Product[]>([]); // List of products on server
  layoutColumn = signal(true); // selected layout (rows or columns)
  currentPage = signal(1);
  itemsPerPage = computed(() =>
    this.layoutColumn() ? ITEM_FOR_PAGE_COLUMN_LAYOUT : ITEM_FOR_PAGE_ROW_LAYOUT
  );
  destroyRef = inject(DestroyRef);
  search = new FormControl('');

  ngOnInit(): void {
    const firebaseData$ = this.productsFirebaseService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef));

    const searchTerm$ = this.search.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(''),
      map((value) => value!.trim().toLowerCase()),
      debounceTime(300)
    );

    combineLatest([firebaseData$, searchTerm$])
      .pipe(
        map(([firebaseData, searchTerm]) => {
          if (!searchTerm) {
            return firebaseData;
          }
          return firebaseData.filter((item: any) =>
            item.model.toLowerCase().includes(searchTerm)
          );
        })
      )
      .subscribe((filteredData) => {
        this.filteredData.set(filteredData);
      });
  }

  // calculate the elements to display depending on selected page number
  displayedItems = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredData().slice(
      startIndex,
      startIndex + this.itemsPerPage()
    );
  });

  // listening to pagination event and updating current page
  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  // Switching layout to column
  toggleLayoutToColumn() {
    this.layoutColumn.set(true);
    this.currentPage.set(1);
  }

  // Switching layout to row
  toggleLayoutToRow() {
    this.layoutColumn.set(false);
    this.currentPage.set(1);
  }

  // Returns true if layout is column
  isColumnLayout() {
    return this.layoutColumn();
  }
}
