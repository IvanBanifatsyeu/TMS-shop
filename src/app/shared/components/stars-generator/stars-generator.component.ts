import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-stars-generator',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './stars-generator.component.html',
  styleUrl: './stars-generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarsGeneratorComponent implements OnChanges {
  rating = input<number | undefined>(0);
  arrStars:string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rating'].currentValue > 0) {
    let num = changes['rating'].currentValue;
    this.arrStars = [];
    for (let i = 1; i <= 5; i++) {
     if(num >=0.9) {
       this.arrStars.push('star_fill');
     } else if (num >= 0.4) {
      this.arrStars.push('star_half');
     } else {
      this.arrStars.push('star-empty');
     }
     num--;
    }
    }
  }
}
