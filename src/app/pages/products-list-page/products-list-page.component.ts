import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListPageComponent {

}
