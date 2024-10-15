import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '../../../core/interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { Router } from '@angular/router';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product | null = null;
  productId: string | undefined = '';
  router = inject(Router);
  productsFirebaseService = inject(ProductFirebaseService);
  isFavorite = signal<boolean>(false);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.productId = this.product?.id;
    this.productsFirebaseService
      .getMyFavorite()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.isFavorite.set(
          res.some((element) => element.id === this.productId)
        );
      });
  }

  goToProduct(productId: string | undefined) {
    this.router.navigate(['/shop', productId]);
  }

  toggleFavorit(product: Product | null, event: Event) {
    event.stopPropagation();
    if (this.isFavorite()) {
      this.productsFirebaseService.removeFromMyFavorite(this.productId!);
    } else {
      this.productsFirebaseService.addItemToMyFavorite(product!);
    }
  }
}
