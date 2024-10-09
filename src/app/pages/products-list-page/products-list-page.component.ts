import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { CommonModule } from '@angular/common';
import { ProductFirebaseService } from '../../core/services/product-firebase.service';
import { Product } from '../../core/interfaces/product.interface';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [TranslateModule, SvgIconComponent, CommonModule, ProductCardComponent],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListPageComponent implements OnInit {
  translate = inject(TranslateService);
  productsFirebaseService = inject(ProductFirebaseService);
  productsList: Product[] | null = null;
  
  ngOnInit(): void {
    this.productsFirebaseService.getProducts().subscribe((res) => {
      this.productsList = res
    })
  }




}
