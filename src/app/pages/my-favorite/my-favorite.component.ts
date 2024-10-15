import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../core/interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-my-favorite',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './my-favorite.component.html',
  styleUrl: './my-favorite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFavoriteComponent implements OnInit {
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  listMyFavorite: Product[] | null = null;
  listMyFavorite_s = signal<Product[] | null>(null);

  ngOnInit(): void {
    const firebaseDataFavorite$ = this.productsFirebaseService
      .getMyFavorite()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.listMyFavorite_s.set(res);
      });
  }
}
