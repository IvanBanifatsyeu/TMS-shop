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
import { TranslateModule} from '@ngx-translate/core';
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
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { combineLatest, debounceTime, map, startWith } from 'rxjs';
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
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);

  categoryList = this.uiDataService.categoriesList;
  colorList = this.uiDataService.colorList;
  sizeList = this.uiDataService.sizeList;

  afterFiltersData_s = signal<Product[]>([]);
  layoutColumn_s = signal(true);
  currentPage_s = signal(1);
  priceMinSelected_s = signal<number>(0);
  priceMaxSelected_s = signal<number>(150);
  isClicked = signal<boolean>(false);

  itemsPerPage_sc = computed(() =>
    this.layoutColumn_s()
      ? ITEM_FOR_PAGE_COLUMN_LAYOUT
      : ITEM_FOR_PAGE_ROW_LAYOUT
  );

  search = new FormControl('', [noCyrillicValidator()]);
  formFilter!: FormGroup;

  ngOnInit(): void {
    let initialCategoryValue: string[] = [];

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['button']) {
          initialCategoryValue = [params['button']];
        }
        this.formFilter = new FormGroup({
          category: new FormControl<string[]>(initialCategoryValue),
          color: new FormControl<string[]>([]),
          size: new FormControl<string[]>([]),
        });
      });

    const firebaseData$ = this.productsFirebaseService.getProducts();

    const searchTerm$ = this.search.valueChanges.pipe(
      startWith(''),
      map((value) => value!.trim().toLowerCase()),
      debounceTime(300)
    );

    const formFilter$ = this.formFilter.valueChanges.pipe(
      startWith(this.formFilter.value)
    );

    combineLatest([firebaseData$, searchTerm$, formFilter$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([data, search, { category, color, size }]) => {
        const categorySet = new Set(category);
        const colorSet = new Set(color);
        const sizeSet = new Set(size);

        const filteredData = data.filter((item: Product) => {
          const includesSearch = item.model.toLowerCase().includes(search);
          const matchCategory =
            !categorySet.size ||
            categorySet.has(item.category.toLocaleLowerCase());
          const matchColor =
            !color.length ||
            item.color.some((color: string) => colorSet.has(color));
          const matchSize =
            !size.length ||
            item.sizes.some((size: string) => sizeSet.has(size));

          return includesSearch && matchCategory && matchColor && matchSize;
        });
        this.afterFiltersData_s.set(filteredData);
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
    const dataAfterAllFilters: Product[] = this.afterFiltersData_s();

    if (!this.isClicked()) {
      const prices = dataAfterAllFilters.map((item) => item.price);

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      return dataAfterAllFilters.filter(
        (item: Product) => item.price >= minPrice && item.price <= maxPrice
      );
    }

    return dataAfterAllFilters.filter((item: Product) => {
      return (
        item.price >= this.priceMinSelected_s() &&
        item.price <= this.priceMaxSelected_s()
      );
    });
  });

  trackForMinMaxPrice = effect(
    (): void => {
      if (!this.isClicked()) {
        const filteredData = this.afterAllFiltersData_sc();
        const maxPrice = this.productsFirebaseService.getMaxPrice(filteredData);
        const minPrice = this.productsFirebaseService.getMinPrice(filteredData);

        this.priceMaxSelected_s.set(maxPrice);
        this.priceMinSelected_s.set(minPrice);
      }
    },
    { allowSignalWrites: true }
  );

  resetcurrentPage = effect(
    () => {
      this.afterAllFiltersData_sc();
      this.currentPage_s.set(1);
    },
    { allowSignalWrites: true }
  );

  toggleLayoutToColumn() {
    this.layoutColumn_s.set(true);
    this.currentPage_s.set(1);
  }

  toggleLayoutToRow() {
    this.layoutColumn_s.set(false);
    this.currentPage_s.set(1);
  }

  clickFilterByPrice() {
    this.isClicked.set(true);
  }
}