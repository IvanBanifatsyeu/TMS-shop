import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  model,
  signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-round-checkbox',
  standalone: true,
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './round-checkbox.component.html',
  styleUrl: './round-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundCheckboxComponent {
  data = input({ title: '', value: '' });
  selectedArr = model<string[]>([]);
  translate = inject(TranslateService);

  toggleColorCheckbox(event: Event, value: any) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedArr.update((prev) => [...prev, value]);
    } else {
      this.selectedArr.update((prev) => prev.filter((item) => item !== value));
    }
  }
}
