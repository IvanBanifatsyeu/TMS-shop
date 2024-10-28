import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { RoundCheckboxComponent } from '../round-checkbox/round-checkbox.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

type Field = {
  [key: string]: any; 
  title: string;
  selected: boolean;
};

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [RoundCheckboxComponent, CommonModule, FormsModule],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectComponent),
      multi: true,
    },
  ],
})
export class MultiselectComponent implements ControlValueAccessor {
  fieldsArray = input<Field[]>([]);
  key = input<string>('');

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  // Вызывается Angular для установки значения
  writeValue(selectedValues: string[]): void { 
    if (selectedValues) {
      this.fieldsArray().forEach((field) => {
        field.selected = selectedValues.includes(field[this.key()]);
      });
    }
  }

  // Регистрируем функцию для уведомления Angular об изменении значений
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // Регистрируем функцию для уведомления Angular о взаимодействии с компонентом
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Функция вызывается при изменении значений в чекбоксах
  onCheckboxChange(): void {
    const selectedValues = this.fieldsArray()
      .filter((field) => field.selected)
      .map((field) => field[this.key()]);

    this.onChange(selectedValues); // Уведомляем Angular об изменении
  }

  // Метод для установки состояния "disabled"
  setDisabledState(isDisabled: boolean): void {
    // Логика для управления disabled состоянием
  }
}
