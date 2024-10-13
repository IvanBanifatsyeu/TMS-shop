import { Injectable } from '@angular/core';
import { CategoryItem } from '../interfaces/categoryItem.interface';

@Injectable({
  providedIn: 'root',
})
export class UiDataService {
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

  colorList: { title: string; value: string; }[] = [
   {title: 'FILTER.RED', value: "red"},
   {title: 'FILTER.WHITE', value: "white"},
   {title: 'FILTER.BLUE', value: "blue"},
   {title: 'FILTER.GREY', value: "grey"},
   {title: 'FILTER.YELLOW', value: "yellow"},
   {title: 'FILTER.BLACK', value: "black"},
   {title: 'FILTER.GREEN', value: "green"},
   {title: 'FILTER.BROWN', value: "brown"},
  ];

  sizeList: { title: string; value: string; }[] = [
    {title: 'FILTER.EXTRA_LARGE', value: "XL"},
    {title: 'FILTER.LARGE', value: "L"},
    {title: 'FILTER.MEDIUM', value: "M"},
    {title: 'FILTER.SMALL', value: "S"},
   ];

}
