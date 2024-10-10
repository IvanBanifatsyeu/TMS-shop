import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
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
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0; 
  @Input() itemsPerPage: number = 0; 
  @Output() currentPageChange: EventEmitter<number> =
    new EventEmitter<number>(); // Event for parent's signal about page change
  currentPage = signal(1); 
  totalPages = signal(0); 

  // generating an array of pages
  pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  // Recalculating the number of pages and the array of pages when changing the input data
  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.updatePagination(); 
    }
  }

  updatePagination() {
    this.totalPages.update(() =>
      Math.ceil(this.totalItems / this.itemsPerPage)
    );
    this.currentPage.update(() => 1);
    this.currentPageChange.emit(this.currentPage()); 
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((prev) => prev + 1);
      this.currentPageChange.emit(this.currentPage()); 
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((prev) => prev - 1);
      this.currentPageChange.emit(this.currentPage()); 
    }
  }

  goToPage(page: number) {
    this.currentPage.update(() => page); 
    this.currentPageChange.emit(this.currentPage()); 
  }
}
