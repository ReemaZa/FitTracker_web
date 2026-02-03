import { 
  Component, 
  input, 
  output, 
  computed,
  ChangeDetectionStrategy,
  HostBinding,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { ForumPost } from '../../models/post.model';
import { RouterLink } from '@angular/router';
import { FormatCategoryPipe } from '../../pipes/format-category.pipe';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TimeAgoPipe,
    FormatCategoryPipe
  ],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostCardComponent {
  
  
  // ✅ Signal input 
  post = input.required<ForumPost>();
  
  // ✅ Signal output
  like = output<number>();

  // ✅ Computed pour optimisation
  displayTags = computed(() => 
    this.post().tags.slice(0, 3)
  );

  // ✅ HostBinding pour performance
  @HostBinding('attr.data-post-id') get postId() {
    return this.post().id;
  }

  onLike(): void {
   
    this.like.emit(this.post().id);
  }
}