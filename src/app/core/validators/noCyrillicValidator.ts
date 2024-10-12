import { AbstractControl, ValidatorFn } from "@angular/forms";

export function noCyrillicValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      // Регулярное выражение для проверки наличия русских букв
      const hasCyrillic = /[а-яёА-ЯЁ]/.test(value);
      return hasCyrillic ? { 'noCyrillic': true } : null;
    };
  }