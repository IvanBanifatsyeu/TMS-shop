import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent implements OnInit {
  @Input() categoryItem: any;
  @HostBinding('style.backgroundImage') backgroundImage = '';

  ngOnInit() {
     this.backgroundImage = `url(${this.categoryItem.imgUrl})`;
  }
}
