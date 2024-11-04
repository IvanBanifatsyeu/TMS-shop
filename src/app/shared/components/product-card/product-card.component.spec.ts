import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { ProductCardComponent } from './product-card.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { UserDataService } from '../../../core/services/user-data.service';
import { Product } from '../../../core/interfaces/product.interface';

describe('StarsGeneratorComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let componentRef: ComponentRef<ProductCardComponent>;
  let mockUserDataService: any;
  let mockAuthService: any;
  let mockRouter: Router;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(), // Здесь мы создаем мок для navigate
    } as unknown as Router; // Приводим к типу Router

    const mockProductFirebaseService: any = [];
    mockUserDataService = {
      listUserFavorite_s: () => [
        {
          rating: 4.7,
          sizes: ['L'],
          description:
            'These elegant heels are a must-have for your formal wardrobe. With a stylish design, they complement any evening outfit. Comfortable enough for all-night wear.',
          addedAt: '18.09.2024',
          curColor: 'Red',
          category: 'Shoes',
          imgUrl:
            'https://img.freepik.com/free-photo/portrait-woman-s-legs-with-stylish-high-heels-pantyhose_23-2150166063.jpg?t=st=1728325275~exp=1728328875~hmac=65b6d294f9c5da21912631d99aa7cf1f567283bb5adaf1c2e7b47e23f1451a1b&w=740',
          price: 79.99,
          model: 'Elegant Heels',
          color: ['black', 'red'],
          id: 'vAZdcHQU43qJ6AE4FMF0',
        },
      ],
    };
    mockAuthService = [];

    TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ProductFirebaseService,
          useValue: mockProductFirebaseService,
        },
        { provide: UserDataService, useValue: mockUserDataService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('product', {
      rating: 4.7,
      sizes: ['L'],
      description:
        'These elegant heels are a must-have for your formal wardrobe. With a stylish design, they complement any evening outfit. Comfortable enough for all-night wear.',
      addedAt: '18.09.2024',
      curColor: 'Red',
      category: 'Shoes',
      imgUrl:
        'https://img.freepik.com/free-photo/portrait-woman-s-legs-with-stylish-high-heels-pantyhose_23-2150166063.jpg?t=st=1728325275~exp=1728328875~hmac=65b6d294f9c5da21912631d99aa7cf1f567283bb5adaf1c2e7b47e23f1451a1b&w=740',
      price: 79.99,
      model: 'Elegant Heels',
      color: ['black', 'red'],
      id: 'vAZdcHQU43qJ6AE4FMF0',
    } as Product);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial value of true for isFavorite_sc', () => {
    expect(component.isFavorite_sc()).toBe(true);
  });

  it('should calculate correctly computed isFavorite_sc when product is not in favlist', () => {
    // Обновляем метод listUserFavorite_s так, чтобы он возвращал пустой массив
    mockUserDataService.listUserFavorite_s = () => [];

    // Переинициализируем компонент
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    // Устанавливаем входной параметр product заново
    componentRef.setInput('product', {
      rating: 4.7,
      sizes: ['L'],
      description:
        'These elegant heels are a must-have for your formal wardrobe. With a stylish design, they complement any evening outfit. Comfortable enough for all-night wear.',
      addedAt: '18.09.2024',
      curColor: 'Red',
      category: 'Shoes',
      imgUrl:
        'https://img.freepik.com/free-photo/portrait-woman-s-legs-with-stylish-high-heels-pantyhose_23-2150166063.jpg?t=st=1728325275~exp=1728328875~hmac=65b6d294f9c5da21912631d99aa7cf1f567283bb5adaf1c2e7b47e23f1451a1b&w=740',
      price: 79.99,
      model: 'Elegant Heels',
      color: ['black', 'red'],
      id: 'vAZdcHQU43qJ6AE4FMF0',
    } as Product);

    // Запускаем обнаружение изменений для новой инициализации
    fixture.detectChanges();

    // Проверяем, что теперь `isFavorite_sc` возвращает false
    expect(component.isFavorite_sc()).toBe(false);
  });

  it('should display the product image', () => {
    const imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(imgEl.src).toContain(component!.product!.imgUrl);
  });

  it('should navigate to auth if user is not logged in', () => {
    mockAuthService.currentUser_s = jest.fn().mockReturnValue(null);
    const event = new Event('click');
    component.toggleFavorit(component.product, event);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('should navigate to product-page if img clicked', () => {
    const productId = '123';
    component.goToProduct(productId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/shop', productId]);
  });
});
