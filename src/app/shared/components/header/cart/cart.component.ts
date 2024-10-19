import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductFirebaseService } from '../../../../core/services/product-firebase.service';
import { Product } from '../../../../core/interfaces/product.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ProductItemInCart } from '../../../../core/interfaces/productItemInCart.interface';
import { SvgIconComponent } from '../../svg-icon/svg-icon.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ProductCardComponent,
    CommonModule,
    TranslateModule,
    SvgIconComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  listCart_s = signal<ProductItemInCart[]>([]);
  closePopupCart_m = model(true);
  iSshowQuantityPanel = signal<boolean>(false);
  counterQuantity_s = signal<number>(0);

  ngOnInit(): void {
    this.productsFirebaseService
      .getItemsFromMyCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.listCart_s.set(res);
      });
  }

  updateQuantity(
    product: ProductItemInCart,
    quantityNum: number,
    event: Event
  ) {
    event.stopPropagation();

    this.productsFirebaseService
      .updateQuantityOfItemInMyCart(product.id, { quantity: quantityNum })
      .subscribe();
  }

  removeFromCart(product: ProductItemInCart, event: Event) {
    event.stopPropagation();

    this.productsFirebaseService.removeFromMyCart(product.id);
  }

  removeAllFromCart(event: Event) {
    event.stopPropagation();
    this.productsFirebaseService.removeAllFromMyCart().subscribe();
  }

  hideCartPopup() {
    this.closePopupCart_m.set(false);
  }

  showPanelContol(event: Event, product: ProductItemInCart) {
    event.stopPropagation();
    this.counterQuantity_s.set(product.quantity);
    this.iSshowQuantityPanel.set(true);
  }

  decrementCounter() {
    if (this.counterQuantity_s() > 1) {
      this.counterQuantity_s.update((prev) => prev - 1);
    }
  }

  incrementCounter() {
    if (this.counterQuantity_s() < 5) {
      this.counterQuantity_s.update((prev) => prev + 1);
    }
  }

  applyQuantity(event: Event, product: ProductItemInCart) {
    event.stopPropagation();
    this.productsFirebaseService.updateQuantityOfItemInMyCart(product.id, { quantity: this.counterQuantity_s() }).subscribe();
    this.iSshowQuantityPanel.set(false);
    this.counterQuantity_s.set(0);
  }
}
