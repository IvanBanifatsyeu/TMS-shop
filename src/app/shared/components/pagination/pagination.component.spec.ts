import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let componentRef: ComponentRef<PaginationComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
    
    it('renders correct number of pages', () => { 
        componentRef.setInput('totalItems', 100);
        componentRef.setInput('itemsPerPage', 10);
        fixture.detectChanges();

        const pageContainers = fixture.debugElement.queryAll(By.css('[data-testid="pagination__page-container"]'));
        expect(pageContainers.length).toBe(10);
        expect(pageContainers[0].nativeElement.textContent).toEqual(' 1 ');

    })

    it('should emit a clicked page', () => {
                componentRef.setInput('totalItems', 100);
                componentRef.setInput('itemsPerPage', 10);
                fixture.detectChanges();

                const pageContainers = fixture.debugElement.queryAll(
                  By.css('[data-testid="pagination__page-container"]')
        ); 
        
        pageContainers[5]?.triggerEventHandler('click');
        expect(component.currentPage()).toEqual(6);
          
    })

 
});
