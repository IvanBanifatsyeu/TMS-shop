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
  arrStars: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const newRating = changes['rating']?.currentValue;

    if (newRating && newRating > 0) {
      this.arrStars = this.createStarArray(newRating);
    }
  }

  private createStarArray(rating: number): string[] {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(this.getStarType(rating));
      rating--;
    }

    return stars;
  }

  private getStarType(rating: number): string {
    if (rating >= 0.9) {
      return 'star_fill';
    } else if (rating >= 0.4) {
      return 'star_half';
    } else {
      return 'star-empty';
    }
  }
}
