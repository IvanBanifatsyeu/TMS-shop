import {
  ChangeDetectionStrategy,
  Component,
  model,
} from '@angular/core';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dual-range-slider',
  standalone: true,
  imports: [CommonModule, NgxSliderModule, FormsModule],
  templateUrl: './dual-range-slider.component.html',
  styleUrl: './dual-range-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DualRangeSliderComponent {
  value = model<number>(0);
  highValue = model<number>(0);

  options: Options = {
    floor: 0,
    ceil: 150,
    step: 1,
    showTicks: false,

    translate: (value: number): string => {
      return `${value}`;
    },
  };
}
