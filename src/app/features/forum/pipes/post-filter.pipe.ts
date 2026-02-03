import { Pipe, PipeTransform } from '@angular/core';
import { ForumPost } from '../models/post.model';

@Pipe({
  name: 'filterPosts',
  standalone: true,
  pure: true // ✅ CRITIQUE pour performance
})
export class FilterPostsPipe implements PipeTransform {
  transform(posts: ForumPost[], type: 'all' | 'pinned' | 'unpinned' = 'all', category?: string): ForumPost[] {
    if (!posts || !Array.isArray(posts)) return [];
    
    let filtered = posts;
    
    if (type === 'pinned') {
      filtered = filtered.filter(post => post.isPinned);
    } else if (type === 'unpinned') {
      filtered = filtered.filter(post => !post.isPinned);
    }
    
    if (category && category !== 'all') {
      filtered = filtered.filter(post => post.category === category);
    }
    
    return filtered;
  }
}