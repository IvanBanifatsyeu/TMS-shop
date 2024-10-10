import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { Product } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent  {
  productsFirebaseService = inject(ProductFirebaseService);
  featuredProducts: Product[] | null = null;
}

