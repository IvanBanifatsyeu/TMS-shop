import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [SvgIconComponent, CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent  {
  totalItems = input<number>(0);
  itemsPerPage = input<number>(0);
  currentPageModel = model(1);
  totalPages = computed(()=> {
    return Math.ceil(this.totalItems()  / this.itemsPerPage() )
  })

  // generating an array of pages
  pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  nextPage() {
    if (this.currentPageModel() < this.totalPages()) {
      this.currentPageModel.update((prev) => prev + 1); 
    }
  }

  previousPage() {
    if (this.currentPageModel() > 1) {
      this.currentPageModel.update((prev) => prev - 1);
    }
  }

  goToPage(page: number) {
    this.currentPageModel.set(page);
  }
}
