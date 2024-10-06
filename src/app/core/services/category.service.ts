import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryList = [
    { name: 'CATEGORY_CARD.HAT', imgUrl: 'assets/imgs/category/hat.png' },
    { name: 'CATEGORY_CARD.BAGS', imgUrl: 'assets/imgs/category/bags.png' },
    { name: 'CATEGORY_CARD.DRESSES', imgUrl: 'assets/imgs/category/dresses.png' },
    { name: 'CATEGORY_CARD.SHOES', imgUrl: 'assets/imgs/category/shoes.png' },
    { name: 'CATEGORY_CARD.CLOTHES', imgUrl: 'assets/imgs/category/clothes.png' },
  ];
}
