import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserDataService } from '../../core/services/user-data.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-favorite',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, TranslateModule],
  templateUrl: './my-favorite.component.html',
  styleUrl: './my-favorite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFavoriteComponent  {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  userDataService = inject(UserDataService);
  authService = inject(AuthService);
  listUserFavorite_s = computed(() => {
   return this.userDataService.listUserFavorite_s();
  })

  removeAll() {
     this.productsFirebaseService
       .removeAllFromUserFavorite(this.authService.currentUser_s()!.userId!)
       .pipe(takeUntilDestroyed(this.destroyRef))
       .subscribe();
  }
}
