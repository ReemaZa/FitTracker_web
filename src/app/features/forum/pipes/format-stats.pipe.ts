import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatStats',
  standalone: true,
  pure: true
})
export class FormatStatsPipe implements PipeTransform {
  transform(value: number, type: 'views' | 'likes' | 'comments' | 'saves'): string {
    if (!value && value !== 0) return '';
    
    const formatted = this.formatNumber(value);
    
    switch(type) {
      case 'views': return `${formatted} views`;
      case 'likes': return `${formatted} likes`;
      case 'comments': return value === 1 ? '1 comment' : `${formatted} comments`;
      case 'saves': return value === 1 ? '1 save' : `${formatted} saves`;
      default: return formatted;
    }
  }
  
  private formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}