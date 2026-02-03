import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCategory',
  standalone: true,
  pure: true
})
export class FormatCategoryPipe implements PipeTransform {
  private categoryMap: Record<string, { display: string, icon: string }> = {
    'fitness-tips': { display: 'Fitness Tips', icon: 'fitness_center' },
    'nutrition': { display: 'Nutrition', icon: 'restaurant' },
    'motivation': { display: 'Motivation', icon: 'bolt' },
    'qna': { display: 'Q&A', icon: 'help_outline' },
    'all': { display: 'All Topics', icon: 'category' }
  };

  transform(category: string, returnType: 'display' | 'icon' = 'display'): string {
    const mapped = this.categoryMap[category] || { display: category, icon: 'article' };
    return mapped[returnType];
  }
}