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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { combineLatest, debounceTime, map, startWith, tap } from 'rxjs';
import { noCyrillicValidator } from '../../core/validators/noCyrillicValidator';
import { UiDataService } from '../../core/services/uiData.service';
import { ActivatedRoute } from '@angular/router';
import { RoundCheckboxComponent } from '../../shared/components/round-checkbox/round-checkbox.component';
import { DualRangeSliderComponent } from '../../shared/components/dual-range-slider/dual-range-slider.component';
import { MultiselectComponent } from '../../shared/components/multiselect/multiselect.component';
import { MultiselectBoldComponent } from '../../shared/components/multiselect-bold/multiselect-bold.component';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [
    TranslateModule,
    SvgIconComponent,
    CommonModule,
    ProductCardComponent,
    PaginationComponent,
    ReactiveFormsModule,
    RoundCheckboxComponent,
    DualRangeSliderComponent,
    FormsModule,
    MultiselectComponent,
    MultiselectBoldComponent,
  ],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListPageComponent implements OnInit {
  uiDataService = inject(UiDataService);

  productsList_s = signal<Product[]>([]);
  categoryList = this.uiDataService.categoriesList;
  colorList = this.uiDataService.colorList;
  sizeList = this.uiDataService.sizeList;
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  afterFiltersData_s = signal<Product[]>([]);
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
  colorSelectedList_s = signal<string[]>([]);
  sizeSelectedList_s = signal<string[]>([]);
  priceMinSelected_s = signal<number>(0);
  priceMaxSelected_s = signal<number>(150);
  isClicked = signal<boolean>(false);

  arrayOfSelectedSizes: string[] = [];
  arrayOfSelectedColors: string[] = [];
  arrayOfSelectedCategorys: string[] = [];
  formFilter!: FormGroup;

  ngOnInit(): void {
    let initialCategoryValue: string[] = [];

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['button']) {
          initialCategoryValue = [params['button']];
        }
      });

    this.formFilter = new FormGroup({
      category: new FormControl<string[]>(initialCategoryValue),
      color: new FormControl<string[]>([]),
      size: new FormControl<string[]>([]),
    });

    const formFilter$ = this.formFilter.valueChanges.pipe(
      startWith(this.formFilter.value),
      takeUntilDestroyed(this.destroyRef)
    );

    const firebaseData$ = this.productsFirebaseService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef));

    const searchTerm$ = this.search.valueChanges.pipe(
      startWith(''),
      map((value) => value!.trim().toLowerCase()),
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    );

    combineLatest([firebaseData$, searchTerm$, formFilter$])
      .subscribe((data) => {
        console.log('data',data);
        this.afterFiltersData_s.set(
          data[0].filter(
            (item: any) => item.model.toLowerCase().includes(data[1])
            && (data[2].category.length > 0 ? data[2].category.includes(item.category.toLocaleLowerCase()) : true) 
            && (data[2].color.length > 0 ? data[2].color.some((color: string) => item.color.includes(color)) : true) && 
            (data[2].size.length > 0 ? data[2].size.some((size: string) => item.sizes.includes(size)) : true) 
          )
        );
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
    let dataAfterAllFilters: Product[] = this.afterFiltersData_s();

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

  clickFilterByPrice() {
    this.isClicked.set(true);
  }

  onMultiselectCategoryChange(arrayOfSelectedCategorys: string[]) {
    console.log('arrayOfSelectedCategorys', arrayOfSelectedCategorys);
    this.categorySelected_s.set(arrayOfSelectedCategorys);
  }

  onMultiselectColorChange(arrayOfSelectedColors: string[]) {
    this.colorSelectedList_s.set(arrayOfSelectedColors);
  }

  onMultiselectSizeChange(arrayOfSelectedSizes: string[]) {
    this.sizeSelectedList_s.set(arrayOfSelectedSizes);
  }
}
