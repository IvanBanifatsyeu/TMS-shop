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
import { AccountPopupComponent } from './account-popup/account-popup.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription, tap } from 'rxjs';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { Product } from '../../../core/interfaces/product.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NavigationComponent,
    TranslateModule,
    AccountPopupComponent,
    CommonModule,
    SvgIconComponent,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @HostBinding('class.position-absolute') isAbsolute = true;
  isPopupVisible = false;
  translate = inject(TranslateService);
  currentRoute = signal<string>(''); 
  subscription!: Subscription;
  router= inject(Router);
  productsFirebaseService = inject(ProductFirebaseService);
  destroyRef = inject(DestroyRef);
  listMyFavorite_s = signal<Product[] | null>(null);


  ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
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
    } else if (url.startsWith("/shop") || "/my-favorite") {
      this.isAbsolute = false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
}
