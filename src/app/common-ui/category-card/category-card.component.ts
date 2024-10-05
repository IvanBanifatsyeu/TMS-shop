import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { CategoryItem } from '../../core/interfaces/categoryItem.interface';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryCardComponent implements OnInit {
  @Input() categoryItem!: CategoryItem;
  @HostBinding('style.backgroundImage') backgroundImage = '';

  ngOnInit() {
     this.backgroundImage = `url(${this.categoryItem.imgUrl})`;
  }
}
