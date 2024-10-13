import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy, Component, HostBinding, inject, Input, OnInit } from '@angular/core';
import { CategoryItem } from '../../../core/interfaces/categoryItem.interface'; 
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryCardComponent implements OnInit {
  @Input() categoryItem!: CategoryItem;
  @HostBinding('style.backgroundImage') backgroundImage = '';
  translate = inject(TranslateService)

  ngOnInit() {
     this.backgroundImage = `url(${this.categoryItem.imgUrl})`;
  }
}
