import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

type OnlyStringTypes<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

@Component({
  selector: 'app-multiselect-bold',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SvgIconComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './multiselect-bold.component.html',
  styleUrl: './multiselect-bold.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectBoldComponent),
      multi: true,
    },
  ],
})
export class MultiselectBoldComponent<T extends Record<string, any>>
  implements ControlValueAccessor
{
  fieldsArray = input<T[]>([]);
  key = input.required<OnlyStringTypes<T>>();

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  form = computed(() => {
    const controls = this.fieldsArray().reduce((acc, field) => {
      return {
        ...acc,
        [field[this.key()]]: new FormControl(false),
      };
    }, {} as { [key: string]: FormControl });

    return new FormGroup(controls);
  });

  constructor() {
    effect((onCleanup) => {
      const subscription = this.form().valueChanges.subscribe((valueObject) => {
        const resultArr: string[] = [];
        Object.keys(valueObject).forEach((key) => {
          if (valueObject[key]) {
            resultArr.push(key);
          }
        });

        this.onChange(resultArr);
      });
      onCleanup(() => {
        subscription.unsubscribe();
      });
    });
  }

  writeValue(value: string[]): void {
    if (value) {
      const newSet = new Set(value);

      const newControls = this.fieldsArray().reduce((acc, field) => {
        return {
          ...acc,
          [field[this.key()]]: newSet.has(field[this.key()]),
        };
      }, {} as { [key: string]: boolean });
      this.form().setValue(newControls, { emitEvent: false });
    }
  }

  // Метод, который регистрирует функцию изменения значения
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  // Метод, который регистрирует функцию touched
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Активирует или деактивирует компонент
  setDisabledState(isDisabled: boolean): void {
    // Логика для отключения компонента
  }
}
