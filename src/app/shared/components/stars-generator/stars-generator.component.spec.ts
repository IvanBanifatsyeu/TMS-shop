import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StarsGeneratorComponent } from "./stars-generator.component";
import { By } from "@angular/platform-browser";

describe('StarsGeneratorComponent', () => {
  let component: StarsGeneratorComponent;
  let fixture: ComponentFixture<StarsGeneratorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [StarsGeneratorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StarsGeneratorComponent);
    component = fixture.componentInstance;
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

})
