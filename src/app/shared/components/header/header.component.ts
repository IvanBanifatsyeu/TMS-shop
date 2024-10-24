import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  combineLatest,
  filter,
  forkJoin,
  map,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { Product } from '../../../core/interfaces/product.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartComponent } from './cart/cart.component';
import { ProductItemInCart } from '../../../core/interfaces/productItemInCart.interface';
import { AuthService } from '../../../core/services/auth.service';
import { UserDataService } from '../../../core/services/user-data.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NavigationComponent,
    TranslateModule,
    LanguageSwitchComponent,
    CommonModule,
    SvgIconComponent,
    RouterModule,
    CartComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  @HostBinding('class.position-absolute') isAbsolute = true;
  translate = inject(TranslateService);
  router = inject(Router);
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  authService = inject(AuthService);
  userDataService = inject(UserDataService);
  subscription!: Subscription;
  isPopupLanguageVisible = false;
  currentRoute = signal<string>('');

  isPopupCartVisible_s = signal<boolean>(false);
  listCart_s = signal<ProductItemInCart[]>([]);

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url); // Обновляем сигнал при изменении маршрута
        this.handleRouteChange(event.url); // Обрабатываем изменение маршрута
      });

    this.authService
      .getCurrentUser$()
      .pipe(
        switchMap((user: User | null) => {
          if (user) {
            return combineLatest([
              this.productsFirebaseService.getUserFavoriteList(user.uid),
              this.productsFirebaseService.getItemsFromUserCart(user.uid),
            ]).pipe(
              map(([favoriteProducts, cartProducts]) => {
                return { user, favoriteProducts, cartProducts };
              })
            );
          } else {
            return of({ user: null, favoriteProducts: [], cartProducts: [] });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(
        ({
          user,
          favoriteProducts,
          cartProducts,
        }: {
          user: User | null;
          favoriteProducts: Product[];
          cartProducts: ProductItemInCart[];
        }) => {
          this.userDataService.listUserFavorite_s.set(favoriteProducts);
          this.userDataService.listUserCart_s.set(cartProducts);
          if (user) {
            this.authService.currentUser_s.set({
              email: user.email!,
              username: user.displayName!,
              userId: user.uid,
            });
          } else {
            this.authService.currentUser_s.set(null);
          }
        }
      );
  }

  handleRouteChange(url: string): void {
    // добавляем/удаляем класс в зависимости от текущего роута
    if (url === '/') {
      this.isAbsolute = true;
    } else if (url.startsWith('/shop') || '/my-favorite') {
      this.isAbsolute = false;
    }
  }

  showLanguagePopup() {
    this.isPopupLanguageVisible = true;
  }

  hideLanguagePopup() {
    this.isPopupLanguageVisible = false;
  }

  showCartPopup() {
    this.isPopupCartVisible_s.set(true);
  }

  hideCartPopup() {
    this.isPopupCartVisible_s.set(false);
  }
}
