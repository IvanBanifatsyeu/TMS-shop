import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription, tap } from 'rxjs';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { Product } from '../../../core/interfaces/product.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartComponent } from './cart/cart.component';

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
  isPopupLanguageVisible = false;
  isPopupCartVisible = false;
  translate = inject(TranslateService);
  currentRoute = signal<string>('');
  subscription!: Subscription;
  router = inject(Router);
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  listMyFavorite_s = signal<Product[] | null>(null);
  isPopupVisible_s = signal<boolean>(false);
  timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url); // Обновляем сигнал при изменении маршрута
        this.handleRouteChange(event.url); // Обрабатываем изменение маршрута
      });

    const firebaseDataFavorite$ = this.productsFirebaseService
      .getMyFavorite()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.listMyFavorite_s.set(res);
      });
  }

  private handleRouteChange(url: string): void {
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
    this.timeoutId = setTimeout(() => {
      this.isPopupVisible_s.set(true);
    }, 600);
  }

  hideCartPopup() {
     if (this.timeoutId) {
       clearTimeout(this.timeoutId);
       this.timeoutId = null; 
     }
     this.isPopupVisible_s.set(false);
  }
}
