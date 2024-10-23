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
import { AuthService } from '../../core/services/auth.service';
import { UserInterface } from '../../core/interfaces/user.interface';

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
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  product: Product | undefined = undefined;
  imgUrl: string = '';
  idOfProduct: string | null = '';
  currentUser = inject(AuthService).currentUser_s();
  
  listUserFavorite_s = signal<Product[] | []>([]);
  isUserFavorite_s = signal<boolean>(false);

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
    console.log('user👽👽👽👽👽', this.currentUser);

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
   
    this.productsFirebaseService.getUserFavoriteList(this.currentUser!.userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.idOfProduct = this.route.snapshot.paramMap.get('id');
      this.listUserFavorite_s.set(res);
      this.isUserFavorite_s.set(
        res.some((element) => element.id === this.idOfProduct)
      );
    })

    this.productsFirebaseService
      .getItemsFromMyCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.isAddedToCart_s.set(
          res.some((element) => element.idFromMainServer === this.idOfProduct)
        );
        this.listMyCart_s.set(res);
      });
  }


  toggleUserFavorite(product: Product | undefined) {
   
    if (this.isUserFavorite_s()) {
      this.productsFirebaseService.removeFromUserFavorite(this.currentUser!.userId, this.idOfProduct!);
    } else {
      this.productsFirebaseService.addToUserFavorite(this.currentUser!.userId, product!);
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
        this.listMyCart_s().some(
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
