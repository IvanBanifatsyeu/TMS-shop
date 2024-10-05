import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryList = [
    { name: 'HAT', imgUrl: 'assets/imgs/category/hat.png' },
    { name: 'BAGS', imgUrl: 'assets/imgs/category/bags.png' },
    { name: 'DRESSES', imgUrl: 'assets/imgs/category/dresses.png' },
    { name: 'SHOES', imgUrl: 'assets/imgs/category/shoes.png' },
    { name: 'CLOTHES', imgUrl: 'assets/imgs/category/clothes.png' },
  ];
}
