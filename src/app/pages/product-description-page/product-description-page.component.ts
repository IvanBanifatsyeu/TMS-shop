import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TranslateModule} from '@ngx-translate/core';
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { Product } from '../../core/interfaces/product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { StarsGeneratorComponent } from '../../shared/components/stars-generator/stars-generator.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductItemInCart } from '../../core/interfaces/productItemInCart.interface';
import { AuthService } from '../../core/services/auth.service';
import { UserDataService } from '../../core/services/user-data.service';

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
})
export class ProductDescriptionPageComponen implements OnInit {
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  router = inject(Router);
  currentUser = inject(AuthService).currentUser_s();
  userDataService = inject(UserDataService);

  product: Product | undefined = undefined;
  imgUrl: string = '';
  idOfProduct: string | null = '';

  listUserFavorite_s = this.userDataService.listUserFavorite_s;
  listUserCart_s = this.userDataService.listUserCart_s;
  isAlreadyInCart_s = signal<boolean>(false);
  selectedColor_s = signal<string>('');
  selectedSize_s = signal<string>('');
  selectedQuantity_s = signal<number>(0);
  showPopupAddToCart_s = signal<boolean>(false);

  isUserFavorite_sc = computed(() => {
    if (this.listUserFavorite_s() === null) {
      return false;
    }
    return this.listUserFavorite_s()!.some((element) => {
      return element.id === this.idOfProduct;
    });
  });
  orderSum_sc = computed(() => {
    return this.selectedQuantity_s() * this.product!?.price;
  });

  ngOnInit(): void {
    this.idOfProduct = this.route.snapshot.paramMap.get('id');
    this.productsFirebaseService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.idOfProduct = this.route.snapshot.paramMap.get('id');
        this.product = res.find((product) => {
          return product.id === this.idOfProduct;
        });
        this.imgUrl = this.product!.imgUrl;
        this.selectedQuantity_s.set(1);
      });
  }

  toggleUserFavorite(product: Product | undefined) {
    if (!this.currentUser) {
      this.router.navigate(['/auth']);
    } else {
      if (this.isUserFavorite_sc()) {
        this.productsFirebaseService.removeFromUserFavorite(
          this.currentUser!.userId,
          this.idOfProduct!
        );
      } else {
        this.productsFirebaseService.addToUserFavorite(
          this.currentUser!.userId,
          product!
        );
      }
    }
  }

  setSelectedColor(color: string) {
    this.isAlreadyInCart_s.set(false);

    if (this.selectedColor_s() === color) {
      this.selectedColor_s.set('');
    } else {
      this.selectedColor_s.set(color);

      if (
        this.listUserCart_s()!.some(
          (element) =>
            element.idFromMainServer === this.idOfProduct &&
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
        this.listUserCart_s()!.some(
          (element) =>
            element.idFromMainServer === this.idOfProduct &&
            element.color[0] === this.selectedColor_s() &&
            element.sizes[0] === this.selectedSize_s()
        )
      ) {
        this.isAlreadyInCart_s.set(true);
      }
    }
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

  addToUserCart(product: Product) {
    if (!this.currentUser) {
      this.router.navigate(['/auth']);
    } else {
      const productForCart: ProductItemInCart = {
        ...product,
        color: [this.selectedColor_s()],
        sizes: [this.selectedSize_s()],
        quantity: this.selectedQuantity_s(),
        idFromMainServer: product.id,
      };

      this.productsFirebaseService.addItemToUserCart(
        this.currentUser!.userId,
        productForCart
      );
      this.selectedColor_s.set('');
      this.selectedSize_s.set('');
      this.showPopupAddToCart_s.set(true);
      this.selectedQuantity_s.set(1);
    }
  }
}
