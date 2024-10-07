import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { Product } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  productsFirebaseService = inject(ProductFirebaseService);
   products: Product[] = [
    {
      category: 'Hat',
      model: 'Wide-Brim Sun Hat',
      price: 34.99,
      description: 'This stylish wide-brim sun hat provides excellent UV protection. Perfect for days spent at the beach or in the garden. It’s lightweight and comfortable, making it a summer essential.',
      rating: 4.3,
      color: ['white', 'blue'],
      imgUrl: 'https://example.com/wide_brim_sun_hat.jpg'
    },
    {
      category: 'Shoes',
      model: 'Trail Running Shoes',
      price: 79.99,
      description: 'Designed for outdoor enthusiasts, these trail running shoes offer durability and grip. They provide excellent support on uneven terrain. Ideal for both casual jogs and serious hikes.',
      rating: 4.5,
      color: ['black', 'grey', 'red'],
      imgUrl: 'https://example.com/trail_running_shoes.jpg'
    },
    {
      category: 'Dresses',
      model: 'Floral Maxi Dress',
      price: 69.99,
      description: 'This beautiful floral maxi dress is perfect for summer events. It features a flowy design that enhances your silhouette. Dress it up with heels or keep it casual with sandals.',
      rating: 4.7,
      color: ['blue', 'white'],
      imgUrl: 'https://example.com/floral_maxi_dress.jpg'
    },
    {
      category: 'Bags',
      model: 'Vintage Messenger Bag',
      price: 55.99,
      description: 'This vintage messenger bag combines style and functionality. With multiple compartments, it keeps your belongings organized. It’s perfect for school, work, or casual outings.',
      rating: 4.4,
      color: ['brown', 'black'],
      imgUrl: 'https://example.com/vintage_messenger_bag.jpg'
    },
    {
      category: 'Clothes',
      model: 'Cotton Crew Neck T-Shirt',
      price: 19.99,
      description: 'This classic crew neck T-shirt is made from soft, breathable cotton. It’s perfect for layering or wearing on its own. Available in multiple colors, it’s a wardrobe staple.',
      rating: 4.2,
      color: ['grey', 'blue'],
      imgUrl: 'https://example.com/cotton_crew_neck_tshirt.jpg'
    },
    {
      category: 'Hat',
      model: 'Classic Baseball Cap',
      price: 24.99,
      description: 'This classic baseball cap is perfect for sunny days. It features an adjustable strap for a comfortable fit. Ideal for sports or casual outings, it’s a versatile accessory.',
      rating: 4.0,
      color: ['red', 'black'],
      imgUrl: 'https://example.com/classic_baseball_cap.jpg'
    },
    {
      category: 'Shoes',
      model: 'Casual Slip-Ons',
      price: 59.99,
      description: 'These casual slip-ons are designed for comfort and ease. With a stylish design, they’re perfect for everyday wear. They can be dressed up or down depending on the occasion.',
      rating: 4.1,
      color: ['blue', 'grey'],
      imgUrl: 'https://example.com/casual_slip_ons.jpg'
    },
    {
      category: 'Dresses',
      model: 'Elegant Cocktail Dress',
      price: 89.99,
      description: 'This elegant cocktail dress is perfect for special occasions. Its flattering fit and stylish design will make you stand out. Pair it with your favorite heels for a complete look.',
      rating: 4.8,
      color: ['black', 'red'],
      imgUrl: 'https://example.com/elegant_cocktail_dress.jpg'
    },
    {
      category: 'Bags',
      model: 'Travel Backpack',
      price: 79.99,
      description: 'This spacious travel backpack is perfect for weekend getaways. It features multiple compartments for organization. Made from durable materials, it’s built to last.',
      rating: 4.6,
      color: ['green', 'black'],
      imgUrl: 'https://example.com/travel_backpack.jpg'
    },
    {
      category: 'Clothes',
      model: 'Lightweight Jacket',
      price: 49.99,
      description: 'This lightweight jacket is perfect for transitional weather. It’s stylish and functional, with pockets for convenience. Ideal for layering over your favorite outfits.',
      rating: 4.5,
      color: ['grey'],
      imgUrl: 'https://example.com/lightweight_jacket.jpg'
    },
    {
      category: 'Hat',
      model: 'Funky Bucket Hat',
      price: 29.99,
      description: 'This funky bucket hat adds a fun touch to any outfit. It’s perfect for festivals, beach days, or just hanging out. Made from breathable material for all-day comfort.',
      rating: 4.1,
      color: ['white', 'blue', 'green'],
      imgUrl: 'https://example.com/funky_bucket_hat.jpg'
    },
    {
      category: 'Shoes',
      model: 'Ankle Boots',
      price: 99.99,
      description: 'These stylish ankle boots are perfect for any season. With a comfortable heel and chic design, they can elevate any outfit. Pair them with jeans or a dress for a fashionable look.',
      rating: 4.4,
      color: ['black', 'grey'],
      imgUrl: 'https://example.com/ankle_boots.jpg'
    },
    {
      category: 'Dresses',
      model: 'Casual Summer Dress',
      price: 39.99,
      description: 'This casual summer dress is lightweight and breezy. Perfect for warm weather, it can be dressed up or down. A versatile addition to your summer wardrobe.',
      rating: 4.2,
      color: ['red', 'white'],
      imgUrl: 'https://example.com/casual_summer_dress.jpg'
    },
    {
      category: 'Bags',
      model: 'Elegant Clutch',
      price: 59.99,
      description: 'This elegant clutch is perfect for evenings out. Its sleek design and compact size make it ideal for carrying essentials. Dress it up with your favorite cocktail dress.',
      rating: 4.7,
      color: ['black'],
      imgUrl: 'https://example.com/elegant_clutch.jpg'
    },
    {
      category: 'Clothes',
      model: 'Stylish Hoodie',
      price: 49.99,
      description: 'This stylish hoodie is perfect for lounging or casual outings. Made from soft fabric, it keeps you warm and cozy. With a modern design, it’s a great addition to your wardrobe.',
      rating: 4.3,
      color: ['grey', 'blue'],
      imgUrl: 'https://example.com/stylish_hoodie.jpg'
    },
    {
      category: 'Hat',
      model: 'Knitted Beanie',
      price: 19.99,
      description: 'Stay warm with this cozy knitted beanie. It’s perfect for chilly days and adds a stylish touch to any outfit. Available in various colors to match your style.',
      rating: 4.5,
      color: ['red', 'grey'],
      imgUrl: 'https://example.com/knitted_beanie.jpg'
    },
    {
      category: 'Shoes',
      model: 'Platform Sandals',
      price: 69.99,
      description: 'These platform sandals are trendy and comfortable. They provide height without sacrificing comfort. Perfect for summer outings or casual events.',
      rating: 4.0,
      color: ['blue', 'white'],
      imgUrl: 'https://example.com/platform_sandals.jpg'
    },
    {
      category: 'Dresses',
      model: 'Simple Shift Dress',
      price: 39.99,
      description: 'This simple shift dress is a versatile wardrobe staple. It can be dressed up with accessories or kept casual. Made from soft fabric, it’s comfortable for all-day wear.',
      rating: 4.2,
      color: ['black', 'green'],
      imgUrl: 'https://example.com/simple_shift_dress.jpg'
    },
    {
      category: 'Bags',
      model: 'Fashionable Tote Bag',
      price: 45.99,
      description: 'This fashionable tote bag is perfect for everyday use. It features ample space and stylish design. Carry your essentials in style with this chic accessory.',
      rating: 4.6,
      color: ['grey', 'blue'],
      imgUrl: 'https://example.com/fashionable_tote_bag.jpg'
    },
    {
      category: 'Clothes',
      model: 'Chic Blazer',
      price: 99.99,
      description: 'This chic blazer is perfect for work or evening outings. It offers a tailored fit that flatters your figure. Pair it with trousers or a dress for a sophisticated look.',
      rating: 4.4,
      color: ['black'],
      imgUrl: 'https://example.com/chic_blazer.jpg'
    },
    {
      category: 'Hat',
      model: 'Retro Bucket Hat',
      price: 25.99,
      description: 'Embrace the retro trend with this stylish bucket hat. It’s perfect for summer festivals or beach days. Made from durable materials for long-lasting wear.',
      rating: 4.1,
      color: ['red', 'white'],
      imgUrl: 'https://example.com/retro_bucket_hat.jpg'
    },
    {
      category: 'Shoes',
      model: 'Elegant Heels',
      price: 79.99,
      description: 'These elegant heels are a must-have for your formal wardrobe. With a stylish design, they complement any evening outfit. Comfortable enough for all-night wear.',
      rating: 4.7,
      color: ['black'],
      imgUrl: 'https://example.com/elegant_heels.jpg'
    },
    {
      category: 'Dresses',
      model: 'Bohemian Dress',
      price: 89.99,
      description: 'This bohemian dress features a flowy design and intricate details. Perfect for casual outings or summer festivals. Pair it with sandals for a laid-back look.',
      rating: 4.3,
      color: ['blue', 'white', 'red'],
      imgUrl: 'https://example.com/bohemian_dress.jpg'
    },
    {
      category: 'Bags',
      model: 'Sporty Backpack',
      price: 39.99,
      description: 'This sporty backpack is perfect for outdoor adventures. It offers ample space and durable materials. Ideal for hiking, traveling, or daily commutes.',
      rating: 4.5,
      color: ['green', 'black'],
      imgUrl: 'https://example.com/sporty_backpack.jpg'
    },
    {
      category: 'Clothes',
      model: 'Warm Sweater',
      price: 59.99,
      description: 'Stay cozy in this warm sweater during colder months. It’s soft and comfortable, making it perfect for layering. Available in a range of colors to suit your style.',
      rating: 4.6,
      color: ['grey', 'blue'],
      imgUrl: 'https://example.com/warm_sweater.jpg'
    },
    {
      category: 'Hat',
      model: 'Stylish Fedora',
      price: 44.99,
      description: 'This stylish fedora is perfect for adding flair to your outfit. It’s made from high-quality materials for durability. Great for both casual and formal occasions.',
      rating: 4.2,
      color: ['black', 'brown'],
      imgUrl: 'https://example.com/stylish_fedora.jpg'
    },
    {
      category: 'Shoes',
      model: 'Chunky Sneakers',
      price: 89.99,
      description: 'These trendy chunky sneakers add a stylish touch to any outfit. They provide comfort and support for all-day wear. Pair them with jeans or dresses for a chic look.',
      rating: 4.4,
      color: ['white', 'grey'],
      imgUrl: 'https://example.com/chunky_sneakers.jpg'
    },
    {
      category: 'Dresses',
      model: 'Lace Evening Dress',
      price: 109.99,
      description: 'This lace evening dress is perfect for special occasions. It features intricate detailing and a flattering silhouette. You’ll feel confident and elegant in this stunning piece.',
      rating: 4.9,
      color: ['black', 'red'],
      imgUrl: 'https://example.com/lace_evening_dress.jpg'
    },
    {
      category: 'Bags',
      model: 'Stylish Crossbody Bag',
      price: 49.99,
      description: 'This stylish crossbody bag is perfect for hands-free convenience. It’s compact yet spacious enough for your essentials. Great for day trips or nights out.',
      rating: 4.3,
      color: ['grey', 'blue'],
      imgUrl: 'https://example.com/stylish_crossbody_bag.jpg'
    },
    {
      category: 'Clothes',
      model: 'Trendy Joggers',
      price: 39.99,
      description: 'These trendy joggers are perfect for lounging or running errands. Made from soft fabric, they provide comfort and style. Pair them with a hoodie for a complete look.',
      rating: 4.5,
      color: ['black', 'green'],
      imgUrl: 'https://example.com/trendy_joggers.jpg'
    }
  ];
  
  

  ngOnInit(): void {
    this.productsFirebaseService.getProducts().subscribe((res) => {
      res.map((product) => {
        console.log(product.imgUrl);
      })
    });
  }
  // addToServer() {console.log('add to server');
  //   this.products.map((product) => {
  //     this.productsFirebaseService.addItem(product);
  //   })
  // }
}
