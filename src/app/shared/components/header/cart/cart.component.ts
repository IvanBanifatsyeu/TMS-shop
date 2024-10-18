import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
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

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  listCartFromFirebase_s = signal<Product[]>([]);
  // zzz
  listCartForDisplay_s = computed(() => {
    const listForDisplayInCart: ProductItemInCart[] = [];
    this.listCartFromFirebase_s()!.forEach((product) => {
      product.arrItemsInCart!.map((value) => {
        listForDisplayInCart.push({
          ...product,
          color: [value.color],
          sizes: [value.size],
          quantity: value.quantity,
          orderId: value.orderId,
          // arrItemsInCart: [value],
        });
      });
    });

  console.log('%c💡 listForDisplayInCart' ,'font-size: 16px; color: red; font-weight: bold;', listForDisplayInCart );
    return listForDisplayInCart;
  });

  ngOnInit(): void {
    this.productsFirebaseService
      .getItemsFromMyCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.listCartFromFirebase_s.set(res);
      });
  }

  removeFromCart(product: Product, event: Event) {
    event.stopPropagation();
    console.log(product);

    if (product.arrItemsInCart?.length === 1) {
      this.productsFirebaseService.removeFromMyCart(product.id);
    } else {
    }

    // this.productsFirebaseService.removeItemFromMyCart(product);
  }
}
