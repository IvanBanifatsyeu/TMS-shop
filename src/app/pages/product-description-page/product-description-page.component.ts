import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { Product } from '../../core/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { StarsGeneratorComponent } from '../../shared/components/stars-generator/stars-generator.component';

@Component({
  selector: 'app-product-description-page',
  standalone: true,
  imports: [CurrencyPipe, SvgIconComponent, StarsGeneratorComponent],
  templateUrl: './product-description-page.component.html',
  styleUrl: './product-description-page.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDescriptionPageComponen implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  product: Product | undefined = undefined;
  imgUrl: string | undefined = '';
  id: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productsFirebaseService.getProducts().subscribe((res) => {
      this.id = this.route.snapshot.paramMap.get('id');

      this.product = res.find((product) => {
        return product.id === this.id;
      });
      this.imgUrl = this.product?.imgUrl;
    });

    
  }
}
