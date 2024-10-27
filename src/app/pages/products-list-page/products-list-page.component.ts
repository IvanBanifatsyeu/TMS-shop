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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, map, startWith } from 'rxjs';
import { noCyrillicValidator } from '../../core/validators/noCyrillicValidator';
import { UiDataService } from '../../core/services/uiData.service';
import { ActivatedRoute } from '@angular/router';
import { RoundCheckboxComponent } from '../../shared/components/round-checkbox/round-checkbox.component';
import { DualRangeSliderComponent } from '../../shared/components/dual-range-slider/dual-range-slider.component';

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
    RoundCheckboxComponent,
    DualRangeSliderComponent,
    FormsModule,
  ],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListPageComponent implements OnInit {
  uiDataService = inject(UiDataService);
  categoryList = this.uiDataService.categoryList;
  colorList = this.uiDataService.colorList.map((color) => ({
    ...color,
    selected: false,
  }));
  sizeList = this.uiDataService.sizeList.map((size) => ({
    ...size,
    selected: false,
  }));
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
  colorSelectedList_s = signal<{ selected: boolean; title: string }[]>(
    this.colorList
  );
  sizeSelectedList_s = signal<{ selected: boolean; title: string }[]>(
    this.sizeList
  );
  priceMinSelected_s = signal<number>(0);
  priceMaxSelected_s = signal<number>(150);
  isClicked = signal<boolean>(false);

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
      startWith(''),
      map((value) => value!.trim().toLowerCase()),
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
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
        this.afterSearchData_s.set(data);
        if (!this.isClicked()) {
          this.priceMaxSelected_s.set(
            this.productsFirebaseService.getMaxPrice(data)
          );
          this.priceMinSelected_s.set(
            this.productsFirebaseService.getMinPrice(data)
          );
        }
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
    let dataAfterAllFilters: Product[] = this.afterSearchData_s();

    if (
      this.categorySelected_s().length > 0 ||
      this.colorSelectedList_s().some((color) => color.selected) ||
      this.sizeSelectedList_s().some((size) => size.selected)
    ) {
      dataAfterAllFilters = this.afterSearchData_s()
        .filter((item: any) =>
          this.categorySelected_s().length > 0
            ? this.categorySelected_s().includes(
                item.category.toLocaleLowerCase()
              )
            : true
        )
        .filter((item: any) => {
          if (this.colorSelectedList_s().some((color) => color.selected)) {
            const arrayOfSelectedColor = this.colorSelectedList_s()
              .filter((color) => color.selected)
              .map((color) => color.title);

            return arrayOfSelectedColor.some((color) =>
              item.color.includes(color)
            );
          } else {
            return true;
          }
        })
        .filter((item: any) => {
          if (this.sizeSelectedList_s().some((size) => size.selected)) {
            const arrayOfSelectedSize = this.sizeSelectedList_s()
              .filter((size) => size.selected)
              .map((size) => size.title);

            return arrayOfSelectedSize.some((size) =>
              item.sizes.includes(size)
            );
          } else {
            return true;
          }
        });
    }

    if (!this.isClicked()) {
      let minPrice = Math.min(...dataAfterAllFilters.map((item) => item.price));
      let maxPrice = Math.max(...dataAfterAllFilters.map((item) => item.price));

      dataAfterAllFilters = dataAfterAllFilters.filter((item: any) => {
        return item.price >= minPrice && item.price <= maxPrice;
      });
    } else {
      dataAfterAllFilters = dataAfterAllFilters.filter((item: any) => {
        return (
          item.price >= this.priceMinSelected_s() &&
          item.price <= this.priceMaxSelected_s()
        );
      });
    }

    return dataAfterAllFilters;
  });

  trackForMinMaxPrice = effect(
    (): void => {
      if (!this.isClicked()) {
        this.priceMaxSelected_s.set(
          this.productsFirebaseService.getMaxPrice(
            this.afterAllFiltersData_sc()
          )
        );
        this.priceMinSelected_s.set(
          this.productsFirebaseService.getMinPrice(
            this.afterAllFiltersData_sc()
          )
        );
      }
    },
    { allowSignalWrites: true }
  );

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
      this.colorSelectedList_s.update((prev) => [...prev, color.value]);
    } else {
      this.colorSelectedList_s.update((prev) =>
        prev.filter((item) => item !== color.value)
      );
    }
  }

  calculateTotalItemsByColor(TargetColor: string) {
    return this.afterAllFiltersData_sc().filter((item: any) =>
      item.color.includes(TargetColor)
    ).length;
  }

  clickFilterByPrice() {
    this.isClicked.set(true);
  }

  toggleRoundCheckbox(
    value: { title: string; selected: boolean },
    type?: string
  ) {
    const isChecked = !value.selected;

    if (type === 'size') {
      const sizeSelectedList = this.sizeSelectedList_s().map((item) => {
        if (item.title === value.title) {
          return { ...item, selected: isChecked };
        } else {
          return item;
        }
      });
      this.sizeSelectedList_s.set(sizeSelectedList);
    } else if (type === 'color') {
      const colorSelectedList = this.colorSelectedList_s().map((item) => {
        if (item.title === value.title) {
          return { ...item, selected: isChecked };
        } else {
          return item;
        }
      });
      this.colorSelectedList_s.set(colorSelectedList);
    }
  }
}
