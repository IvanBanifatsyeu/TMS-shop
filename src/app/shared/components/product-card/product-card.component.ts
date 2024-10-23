import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
} from '@angular/core';
import { Product } from '../../../core/interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { Router } from '@angular/router';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { UserDataService } from '../../../core/services/user-data.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
  router = inject(Router);
  authService = inject(AuthService);
  productsFirebaseService = inject(ProductFirebaseService);
  userDataService = inject(UserDataService);
  isFavorite_sc = computed(() => {
    if (this.userDataService.listUserFavorite_s() === null) {
      return false;
    } else {
      return this.userDataService
        .listUserFavorite_s()!
        .some((element) => element.id === this.product!.id);
    }
  });
  destroyRef = inject(DestroyRef);

  goToProduct(productId: string | undefined) {
    this.router.navigate(['/shop', productId]);
  }

  toggleFavorit(product: Product | null, event: Event) {
    event.stopPropagation();

    if (this.isFavorite_sc()) {
      this.productsFirebaseService.removeFromUserFavorite(
        this.authService.currentUser_s()!.userId,
        product!.id
      );
    } else {
      this.productsFirebaseService.addToUserFavorite(
        this.authService.currentUser_s()!.userId,
        product!
      );
    }
  }
}
