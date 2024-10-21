import {
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
import { LogPipe } from '../../shared/pipes/log.pipe';
import { ProductItemInCart } from '../../core/interfaces/productItemInCart.interface';

@Component({
  selector: 'app-product-description-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    SvgIconComponent,
    StarsGeneratorComponent,
    TranslateModule,
    CommonModule,
    LogPipe,
  ],
  templateUrl: './product-description-page.component.html',
  styleUrl: './product-description-page.component.scss',
})
export class ProductDescriptionPageComponen implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  product: Product | undefined = undefined;
  imgUrl: string = '';
  id: string | null = '';
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  listMyFavorite_s = signal<Product[] | []>([]);
  isFavorite_s = signal<boolean>(false);
  listMyCart_s = signal<ProductItemInCart[]>([]);
  isAddedToCart_s = signal<boolean>(false);
  isAlreadyInCart_s = signal<boolean>(false);
  selectedColor_s = signal<string>('');
  selectedSize_s = signal<string>('');
  selectedQuantity_s = signal<number>(0);
  showPopupAddToCart_s = signal<boolean>(false);
  orderSum_sc = computed(() => {
    return this.selectedQuantity_s() * this.product!?.price;
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
        this.imgUrl = this.product!.imgUrl;
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
        this.isAddedToCart_s.set(
          res.some((element) => element.idFromMainServer === this.id)
        );
        this.listMyCart_s.set(res);
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
    this.isAlreadyInCart_s.set(false);

    if (this.selectedColor_s() === color) {
      this.selectedColor_s.set('');
    } else {
      this.selectedColor_s.set(color);

      if (
        this.listMyCart_s().some(
          (element) =>
            element.idFromMainServer === this.id &&
            element.color[0] === this.selectedColor_s() &&
            element.sizes[0] === this.selectedSize_s()
        )
      ) {
        this.isAlreadyInCart_s.set(true);
      }
    }
  }

  setSelectedSize(size: string, event: Event) {
    event.stopPropagation();
    this.isAlreadyInCart_s.set(false);

    if (this.selectedSize_s() === size) {
      this.selectedSize_s.set('');
    } else {
      this.selectedSize_s.set(size);

      if (
        this.listMyCart_s().some(
          (element) =>
            element.idFromMainServer === this.id &&
            element.color[0] === this.selectedColor_s() &&
            element.sizes[0] === this.selectedSize_s()
        )
      ) {
        this.isAlreadyInCart_s.set(true);
      }
    }
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();

    const productForCart: ProductItemInCart = {
      ...product,
      color: [this.selectedColor_s()],
      sizes: [this.selectedSize_s()],
      quantity: this.selectedQuantity_s(),
      idFromMainServer: product.id,
    };

    this.productsFirebaseService.addItemToMyCart(productForCart);
    this.selectedColor_s.set('');
    this.selectedSize_s.set('');
    this.showPopupAddToCart_s.set(true);
    this.selectedQuantity_s.set(1);
  }

  handleAnimationEnd() {
    this.showPopupAddToCart_s.set(false);
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
