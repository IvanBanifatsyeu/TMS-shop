import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import {  FormsModule } from '@angular/forms';

@Component({
  selector: 'app-round-checkbox',
  standalone: true,
  imports: [TranslateModule, SvgIconComponent, FormsModule],
  templateUrl: './round-checkbox.component.html',
  styleUrl: './round-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundCheckboxComponent {
  title = input('');
  selected = input(false);
  translate = inject(TranslateService);
}
