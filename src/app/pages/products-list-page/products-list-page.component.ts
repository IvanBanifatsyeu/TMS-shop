import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  effect,
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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, map, startWith } from 'rxjs';
import { noCyrillicValidator } from '../../core/validators/noCyrillicValidator';
import { UiDataService } from '../../core/services/uiData.service';
import { ActivatedRoute } from '@angular/router';

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
  uiDataService = inject(UiDataService);
  colorList = this.uiDataService.colorList;
  categoryList = this.uiDataService.categoryList;
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  afterSearchData_s = signal<Product[]>([]);
  layoutColumn_s = signal(true); // selected layout (rows or columns)
  currentPage_s = signal(1);
  itemsPerPage_sc = computed(() =>
    this.layoutColumn_s()
      ? ITEM_FOR_PAGE_COLUMN_LAYOUT
      : ITEM_FOR_PAGE_ROW_LAYOUT
  );
  destroyRef = inject(DestroyRef);
  search = new FormControl('', [noCyrillicValidator()]);
  route = inject(ActivatedRoute);
  categorySelected_s = signal<string[]>([]);
  colorSelected_s = signal<string[]>([]);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['button']) {
          this.categorySelected_s.set([params['button']]);
        }
      });

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
      .subscribe((data) => {
        console.log(data);
        
        this.afterSearchData_s.set(data);
      });
  }

  displayedItems_sc = computed(() => {
    const startIndex = (this.currentPage_s() - 1) * this.itemsPerPage_sc();
    return this.afterAllFiltersData_sc().slice(
      startIndex,
      startIndex + this.itemsPerPage_sc()
    );
  });

  afterAllFiltersData_sc = computed(() => {
    if (
      this.categorySelected_s().length > 0 ||
      this.colorSelected_s().length > 0
    ) {
      return this.afterSearchData_s()
        .filter((item: any) =>
          this.categorySelected_s().length > 0
            ? this.categorySelected_s().includes(
                item.category.toLocaleLowerCase()
              )
            : true
        )
        .filter((item: any) =>
          this.colorSelected_s().length > 0
            ? this.colorSelected_s().some((color) => item.color.includes(color))
            : true
        );
    } else {
      return this.afterSearchData_s();
    }
  });

  // to reset the page when filters are applied
  resetcurrentPage = effect(
    () => {
      const filteredData = this.afterAllFiltersData_sc();
      this.currentPage_s.set(1);
    },
    { allowSignalWrites: true }
  );

  // listening to pagination event and updating current page
  onPageChange(page: number) {
    this.currentPage_s.set(page);
  }

  // Switching layout to column
  toggleLayoutToColumn() {
    this.layoutColumn_s.set(true);
    this.currentPage_s.set(1);
  }

  // Switching layout to row
  toggleLayoutToRow() {
    this.layoutColumn_s.set(false);
    this.currentPage_s.set(1);
  }

  // Returns true if layout is column
  isColumnLayout() {
    return this.layoutColumn_s();
  }

  toggleCategoryCheckbox(event: Event, categoryItem: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.categorySelected_s.update((prev) => [
        ...prev,
        categoryItem.category,
      ]);
    } else {
      this.categorySelected_s.update((prev) =>
        prev.filter((item) => item !== categoryItem.category)
      );
    }
  }

  toggleColorCheckbox(event: Event, color: any) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.colorSelected_s.update((prev) => [...prev, color.value]);
    } else {
      this.colorSelected_s.update((prev) =>
        prev.filter((item) => item !== color.value)
      );
    }
  }

  calculateTotalItemsByColor(TargetColor: string) {
    return this.afterAllFiltersData_sc().filter((item: any) => item.color.includes(TargetColor)).length
  }
}
