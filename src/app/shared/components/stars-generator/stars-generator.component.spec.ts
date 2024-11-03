import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StarsGeneratorComponent } from "./stars-generator.component";
import { By } from "@angular/platform-browser";
import { ComponentRef } from "@angular/core";

describe('StarsGeneratorComponent', () => {
  let component: StarsGeneratorComponent;
  let fixture: ComponentFixture<StarsGeneratorComponent>;
  let componentRef: ComponentRef<StarsGeneratorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [StarsGeneratorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StarsGeneratorComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('renders default stars-text', () => {
    const textContainer = fixture.debugElement.query(
      By.css('[data-testid="stars-generator__text"]')
    );
    expect(textContainer.nativeElement.textContent).toBe('no data');
  })

  it('renders custom stars-text', () => {
    componentRef.setInput('title', 'custom text');
    fixture.detectChanges();
    
    const textContainer = fixture.debugElement.query(
      By.css('[data-testid="stars-generator__text"]')
    );
    expect(textContainer.nativeElement.textContent).toBe('custom text');
  })

})


