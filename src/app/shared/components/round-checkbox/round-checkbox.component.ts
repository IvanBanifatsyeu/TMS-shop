import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import {  ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-round-checkbox',
  standalone: true,
  imports: [TranslateModule, SvgIconComponent, FormsModule],
  templateUrl: './round-checkbox.component.html',
  styleUrl: './round-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RoundCheckboxComponent),
      multi: true,
    },
  ],
})
export class RoundCheckboxComponent implements ControlValueAccessor {
  translate = inject(TranslateService);

  // private cdr = inject(ChangeDetectorRef); // dddel
  title = input('');
  value: boolean = false;

  onChange = (value: boolean) => {
    console.log('onChange💛💛', value);
  };
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.value = value;
    // this.cdr.markForCheck(); // dddel
    console.log('writeValue❤️', value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Реализация для отключения компонента
  }
  
}
