import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
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
export class FooterComponent implements OnInit {
  productsFirebaseService = inject(ProductFirebaseService);
  
  

  ngOnInit(): void {
    this.productsFirebaseService.getProducts().subscribe((res) => {
      res.map((product) => {
        console.log(product.addedAt);
      })
    });
    // console.log(this.date.toLocaleDateString() )
  }
  // addToServer() {console.log('add to server');
  //   this.products.map((product) => {
  //     this.productsFirebaseService.addItem(product);
  //   })
  // }
}
