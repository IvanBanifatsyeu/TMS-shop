import { Component, inject } from '@angular/core';
import { CategoryCardComponent } from '../../common-ui/category-card/category-card.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../data/services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategoryCardComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  categoryService: CategoryService = inject(CategoryService);
  categoryList = this.categoryService.categoryList;

  log(val:any) { console.log(val); }
}
