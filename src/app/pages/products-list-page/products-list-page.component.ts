import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListPageComponent {
  translate = inject(TranslateService);
}
