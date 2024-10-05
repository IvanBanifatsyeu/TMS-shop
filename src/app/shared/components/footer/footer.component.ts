import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service'; 

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
   productsFirebaseService = inject(ProductFirebaseService)

   ngOnInit(): void {
   this.productsFirebaseService.getProducts().subscribe((res) => {
      console.log(res)
   })

      //  console.log(this.productsFirebaseService.getProducts())
   }
}
