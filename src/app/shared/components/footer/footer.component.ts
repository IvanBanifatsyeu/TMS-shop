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
  featuredProducts: Product[] | null = null;


  ngOnInit(): void {
    // this.productsFirebaseService.getProducts().subscribe((res) => {
    //   const sortedByDate = res.sort((a, b) => {
    //     const dateA: Date = new Date(a.addedAt.split('.').reverse().join('-'));
    //     const dateB: Date = new Date(b.addedAt.split('.').reverse().join('-'));
    //     return dateB.getTime() - dateA.getTime();
    //   });

    //   this.featuredProducts = sortedByDate.slice(0, 4);
    //   console.log(this.featuredProducts);
    // });
  }
}
// addToServer() {console.log('add to server');
//   this.products.map((product) => {
//     this.productsFirebaseService.addItem(product);
//   })
// }
