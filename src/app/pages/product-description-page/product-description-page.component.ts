import {
  ChangeDetectionStrategy,
  Component,
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

@Component({
  selector: 'app-product-description-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    SvgIconComponent,
    StarsGeneratorComponent,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './product-description-page.component.html',
  styleUrl: './product-description-page.component.scss',
  //  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDescriptionPageComponen implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  product: Product | undefined = undefined;
  imgUrl: string | undefined = '';
  id: string | null = '';
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  listMyFavorite_s = signal<Product[] | null>(null);
  isFavorite = signal<boolean>(false);

  //zzz
  selectedColor_s = signal<string>('');
  selectedSize_s = signal<string>('');
  //zzz

  ngOnInit(): void {
    this.productsFirebaseService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.id = this.route.snapshot.paramMap.get('id');
        this.product = res.find((product) => {
          return product.id === this.id;
        });
        this.imgUrl = this.product?.imgUrl;
      });
    const firebaseDataFavorite$ = this.productsFirebaseService
      .getMyFavorite()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.id = this.route.snapshot.paramMap.get('id');
        this.listMyFavorite_s.set(res);
        this.isFavorite.set(res.some((element) => element.id === this.id));
      });
  }

  toggleFavorit(product: Product | undefined, event: Event) {
    event.stopPropagation();
    if (this.isFavorite()) {
      this.productsFirebaseService.removeFromMyFavorite(this.id!);
    } else {
      this.productsFirebaseService.addItemToMyFavorite(product!);
    }
  }

  setSelectedColor(color: string, event: Event) {
    event.stopPropagation();

    if (this.selectedColor_s() === color) {
      this.selectedColor_s.set('');
    } else {
      this.selectedColor_s.set(color);
    }
    console.log('🚀 ', this.selectedColor_s());
  }

  setSelectedSize(size: string, event: Event) {
    event.stopPropagation();
    if (this.selectedSize_s() === size) {
      this.selectedSize_s.set('');
    } else {
      this.selectedSize_s.set(size);
    }

    console.log('🚀 ', this.selectedSize_s());
  }

  addToCart(product: Product | undefined, event: Event) {
    event.stopPropagation();
  }
}
