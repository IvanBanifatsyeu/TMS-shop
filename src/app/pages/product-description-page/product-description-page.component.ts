import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-description-page',
  standalone: true,
  imports: [],
  templateUrl: './product-description-page.component.html',
  styleUrl: './product-description-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDescriptionPageComponent {

}
