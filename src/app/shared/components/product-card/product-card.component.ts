import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../../../core/interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product | null = null;
  productId : string | undefined = ''
  router = inject(Router)

  ngOnInit(): void {
    this.productId = this.product?.id
  }
  
  goToProduct(productId: string | undefined) {
    this.router.navigate(['/shop', productId]);
  }

}
