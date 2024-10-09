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
  @Input() totalItems: number = 0; // Общее количество элементов
  @Input() itemsPerPage: number = 8; // Элементы на странице
  @Output() currentPageChange: EventEmitter<number> =
    new EventEmitter<number>(); // Событие для изменения страницы
  currentPage = signal(1); // Текущая страница
  totalPages = signal(0); // всего страниц

  // Генерация массива страниц
  pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  // Пересчитываем количество страниц и массив страниц при изменении входных данных
  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.updatePagination(); 
    }
  }

  updatePagination() {
    // Пересчитываем количество страниц
    this.totalPages.update(() =>
      Math.ceil(this.totalItems / this.itemsPerPage)
    );

    // Сбрасываем на первую страницу, если данные изменились
    this.currentPage.update(() => 1);
    this.currentPageChange.emit(this.currentPage()); // Эмитируем событие изменения страницы
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((prev) => prev + 1);
      this.currentPageChange.emit(this.currentPage()); // Эмитируем событие
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((prev) => prev - 1);
      this.currentPageChange.emit(this.currentPage()); // Эмитируем событие
    }
  }

  goToPage(page: number) {
    this.currentPage.update(() => page); // Переход на конкретную страницу
    this.currentPageChange.emit(this.currentPage()); // Эмитируем событие
  }
}
