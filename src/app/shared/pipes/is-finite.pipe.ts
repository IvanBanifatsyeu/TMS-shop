import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isFinite',
  standalone: true
})
export class IsFinitePipe implements PipeTransform {

  transform(value: number): boolean {
    console.log('вызывался pipe isFinite',value, isFinite(value) );
    
    return isFinite(value);
  }

}
