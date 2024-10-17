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
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { Product } from '../../core/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { StarsGeneratorComponent } from '../../shared/components/stars-generator/stars-generator.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-description-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    SvgIconComponent,
    StarsGeneratorComponent,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './product-description-page.component.html',
  styleUrl: './product-description-page.component.scss',
  //  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDescriptionPageComponen implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  product: Product | undefined = undefined;
  imgUrl: string | undefined = '';
  id: string | null = '';
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  listMyFavorite_s = signal<Product[] | null>(null);
  listCart_s = signal<Product[] | null>(null);
  isFavorite_s = signal<boolean>(false);
  isAddedToCart_s = signal<boolean>(false);
  selectedColor_s = signal<string>('');
  selectedSize_s = signal<string>('');
  selectedQuantity_s = signal<number>(0);

  orderSum_sc = computed(() => {
    return this.selectedQuantity_s() * this.product!?.price || 0;
  });

  ngOnInit(): void {
    this.productsFirebaseService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.id = this.route.snapshot.paramMap.get('id');
        this.product = res.find((product) => {
          return product.id === this.id;
        });
        this.imgUrl = this.product?.imgUrl;
        this.selectedQuantity_s.set(1);
      });
    this.productsFirebaseService
      .getMyFavorite()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.id = this.route.snapshot.paramMap.get('id');
        this.listMyFavorite_s.set(res);
        this.isFavorite_s.set(res.some((element) => element.id === this.id));
      });
    this.productsFirebaseService
      .getItemsFromMyCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.listCart_s.set(res);
        this.isAddedToCart_s.set(res.some((element) => element.id === this.id));
        console.log('❤️💛🩷 in cart?', this.isAddedToCart_s());
      });
  }

  toggleFavorit(product: Product | undefined, event: Event) {
    event.stopPropagation();
    if (this.isFavorite_s()) {
      this.productsFirebaseService.removeFromMyFavorite(this.id!);
    } else {
      this.productsFirebaseService.addItemToMyFavorite(product!);
    }
  }

  setSelectedColor(color: string, event: Event) {
    event.stopPropagation();

    if (this.selectedColor_s() === color) {
      this.selectedColor_s.set('');
    } else {
      this.selectedColor_s.set(color);
    }
    console.log('🚀 ', this.selectedColor_s());
  }

  setSelectedSize(size: string, event: Event) {
    event.stopPropagation();
    if (this.selectedSize_s() === size) {
      this.selectedSize_s.set('');
    } else {
      this.selectedSize_s.set(size);
    }

    console.log('🚀 ', this.selectedSize_s());
  }

  addToCart(product: Product | undefined, event: Event) {
    event.stopPropagation();

    let arrOfORderedItems: { color: string; size: string }[] = [];
    if (this.selectedSize_s() && this.selectedColor_s()) {
      // arrOfORderedItems = [
      //   [this.selectedSize_s(), this.selectedColor_s()],
      // ];

      for (let i = 0; i < this.selectedQuantity_s(); i++) {
        arrOfORderedItems.push({
          color: this.selectedColor_s(),
          size: this.selectedSize_s(),
        });
      }
    }

    // ])

    const productForCart: Product = {
      ...product,
      quantity: arrOfORderedItems,
      color: [this.selectedColor_s()],
      sizes: [this.selectedSize_s()],
      category: product!.category || '',
      model: product!.model || '',
      price: product!.price || 0,
      description: product!.description || '',
      rating: product!.rating || 0,
      id: product!.id || '',
      imgUrl: product!.imgUrl || '',
      addedAt: product!.addedAt || '',
      curColor: product!.curColor || '',
    };

    this.productsFirebaseService.addItemToMyCart(productForCart);
    this.selectedColor_s.set('');
    this.selectedSize_s.set('');
  }

  decreaseQuantity() {
    if (this.selectedQuantity_s() > 1) {
      this.selectedQuantity_s.update((prev) => prev - 1);
    }
  }

  increaseQuantity() {
    if (this.selectedQuantity_s() < 5) {
      this.selectedQuantity_s.update((prev) => prev + 1);
    }
  }
}
