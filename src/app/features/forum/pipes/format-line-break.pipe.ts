import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatLineBreaks',
  standalone: true
})
export class FormatLineBreaksPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br>');
  }
}