import { inject, Injectable } from '@angular/core';
import { CategoryItem } from '../interfaces/categoryItem.interface';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class UiDataService {
   utilsService = inject(UtilsService);

  categoryList: CategoryItem[] = [
    {
      name: 'CATEGORY_CARD.HAT',
      imgUrl: 'assets/imgs/category/hat.png',
      category: 'hat',
    },
    {
      name: 'CATEGORY_CARD.BAGS',
      imgUrl: 'assets/imgs/category/bags.png',
      category: 'bags',
    },
    {
      name: 'CATEGORY_CARD.DRESSES',
      imgUrl: 'assets/imgs/category/dresses.png',
      category: 'dresses',
    },
    {
      name: 'CATEGORY_CARD.SHOES',
      imgUrl: 'assets/imgs/category/shoes.png',
      category: 'shoes',
    },

    {
      name: 'CATEGORY_CARD.CLOTHES',
      imgUrl: 'assets/imgs/category/clothes.png',
      category: 'clothes',
    },
  ];

  categoriesList: { title: string }[] = this.categoryList.map(item => {
    return { title: item.category };
  })

  colorList: { title: string }[] = [
    { title: 'red' },
    { title: 'white' },
    { title: 'blue' },
    { title: 'grey' },
    { title: 'yellow' },
    { title: 'black' },
    { title: 'green' },
    { title: 'brown' },
  ];

  sizeList: { title: string }[] = [
    { title: 'XL' },
    { title: 'L' },
    { title: 'M' },
    { title: 'S' },
  ];

  addColor(color: string) {
    this.colorList.push({ title: color });
  }

  addSize(size: string) {
    this.sizeList.push({ title: size });
  }

  removeColor(color: string) {
    this.colorList = this.colorList.filter((item) => item.title !== color);
  }

  removeSize(size: string) {
    this.sizeList = this.sizeList.filter((item) => item.title !== size);
  }

  getColorsArray(): string[] {
    return this.utilsService.pluck(this.colorList, 'title');
  }
}
