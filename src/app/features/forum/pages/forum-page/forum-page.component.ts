import { 
  Component, 
  inject, 
  signal, 
  computed,
  ChangeDetectionStrategy,
  DestroyRef,
  OnInit 
} from '@angular/core';
import { CommonModule } from '@angular/common';


// Composants
import { PostCardComponent } from '../../components/post-card/post-card.component';

// Pipes
import { FormatCategoryPipe } from '../../pipes/format-category.pipe';
import { FormatStatsPipe } from '../../pipes/format-stats.pipe';
import {FilterPostsPipe} from '../../pipes/post-filter.pipe';
// Services & Models
import { ForumService } from '../../services/forum.service';
import { ForumPost } from '../../models/post.model';
import { CreatePostModalComponent } from '../../components/create-post-modal/create-post-modal/create-post-modal.component';
import { PostService } from '../../services/post.service';
@Component({
  selector: 'app-forum-page',
  standalone: true,
  imports: [
    CommonModule,
    PostCardComponent,
    FormatCategoryPipe,
    FormatStatsPipe,
    FilterPostsPipe,
    CreatePostModalComponent,
  ],
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForumPageComponent {
  private forumService = inject(ForumService);
  private destroyRef = inject(DestroyRef);
  currentUserId=1;
  // === SIGNALS SIMPLIFIÉS ===
  posts = signal<ForumPost[]>([]);
  isLoading = signal(true);
  selectedCategory = signal('all');
  showCreateModal = signal(false);
   isCreatingPost = signal(false); // ← NOUVEAU: pour état de chargement
    private postService = inject(PostService);
  // Challenge avec signals (pas besoin de notify manuel)
  challengeStatus = signal<'idle' | 'active' | 'completed'>('idle');
  streakCount = signal(7);
  timerSeconds = signal(0); // ✅ Timer en signal
  
  private timerInterval?: number;

  // === COMPUTED OPTIMISÉS ===
  filteredPosts = computed(() => {
    const category = this.selectedCategory();
    const allPosts = this.posts();
    
    if (category === 'all') return allPosts;
    return allPosts.filter(post => post.category === category);
  });

  pinnedPosts = computed(() => 
    this.posts().filter(post => post.isPinned)
  );

  timerDisplay = computed(() => {
    const seconds = this.timerSeconds();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  categories = [
    { id: 'all', name: 'All Topics', icon: '🌟' },
    { id: 'fitness-tips', name: 'Fitness Tips', icon: '💪' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'motivation', name: 'Motivation', icon: '🔥' },
    { id: 'qna', name: 'Q&A', icon: '❓' }
  ];

constructor() {
  this.loadPosts();
}

loadPosts(): void {

  const userId = this.currentUserId; // or however you store it

  this.isLoading.set(true);

  this.forumService.getPostsByUser(userId)
    .subscribe({
      next: (posts) => {
        this.posts.set(posts);      // ✅ signal update
        this.isLoading.set(false);  // ✅ signal update
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading.set(false);
      }
    });
}


  // === HANDLERS SIMPLES ===
  onCategorySelect(categoryId: string): void {
    this.selectedCategory.set(categoryId); // ✅ Auto-notify
  }

  onLikePost(postId: number): void {
  // Find the post in the list
  const posts = this.posts();
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) return;
  
  const post = posts[postIndex];
  const liked = post.isLiked;
  
  // Update the specific post in the list
  this.posts.update(currentPosts => {
    return currentPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !liked,
          likes: liked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    });
  });

  // Make API call
  const apiCall$ = liked
    ? this.postService.deleteReaction(1) // Updated to include userId
    : this.postService.addReaction(postId, this.currentUserId, 'LIKE');

  apiCall$.subscribe({
    error: err => {
      console.error('Failed to toggle LIKE reaction', err);
      // Rollback local state
      this.posts.update(currentPosts => {
        return currentPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: liked,
              likes: liked ? p.likes + 1 : p.likes - 1
            };
          }
          return p;
        });
      });
    }
  });
}

  // === TIMER AVEC SIGNAL (pas de notify manuel) ===
  startChallenge(minutes: number): void {
    this.challengeStatus.set('active');
    this.timerSeconds.set(minutes * 60);
    
    this.clearTimer();
    
    this.timerInterval = setInterval(() => {
      this.timerSeconds.update(seconds => {
        if (seconds <= 0) {
          this.clearTimer();
          this.challengeStatus.set('completed');
          this.streakCount.update(s => s + 1);
          return 0;
        }
        return seconds - 1;
      }); // ✅ Auto-notify via signal update
    }, 1000);
  }

 clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
  // Ajoutez ce computed pour le calendrier des streaks
streakCalendar = computed(() => {
  const streak = this.streakCount();
  return [
    { day: 'M', date: 'Mon', completed: streak > 0 },
    { day: 'T', date: 'Tue', completed: streak > 1 },
    { day: 'W', date: 'Wed', completed: streak > 2 },
    { day: 'T', date: 'Thu', completed: streak > 3 },
    { day: 'F', date: 'Fri', completed: streak > 4 },
    { day: 'S', date: 'Sat', completed: streak > 5 },
    { day: 'S', date: 'Sun', completed: streak > 6 }
  ];
});
 // === NOUVEAUX HANDLERS POUR LE MODAL ===
  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  onPostCreated(newPost: ForumPost): void {
    // 1. Mettre à jour la liste des posts (nouveau post en premier)
    this.posts.update(posts => [newPost, ...posts]);
    
    // 2. Réinitialiser l'état
    this.isCreatingPost.set(false);
    this.showCreateModal.set(false);
    
    // 3. Optionnel: Afficher un feedback
    console.log('Post created successfully:', newPost);
    
    // 4. Optionnel: Reset la catégorie sélectionnée
    this.selectedCategory.set(newPost.category);
  }
  // Dans votre ForumPageComponent (parent)
onCancelCreate(): void {
  console.log('Create post cancelled');
  this.showCreateModal.set(false);
}
}