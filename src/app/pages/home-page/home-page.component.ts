import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategoryCardComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  categoryService: CategoryService = inject(CategoryService);
  categoryList = this.categoryService.categoryList;

  // log(val:any) { console.log(val); }
}
