import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  computed,
  effect,
} from '@angular/core';
import { RoundCheckboxComponent } from '../round-checkbox/round-checkbox.component';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';


type OnlyStringTypes<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [
    RoundCheckboxComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
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
export class MultiselectComponent<T extends Record<string, any>>
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
        console.log('Значение поля Multiselect изменилось:', valueObject);
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

  // Вызывается Angular для установки значения
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

  // Регистрируем функцию для уведомления Angular об изменении значений
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // Регистрируем функцию для уведомления Angular о взаимодействии с компонентом
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
