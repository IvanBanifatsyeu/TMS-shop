import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryList = [
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
}
