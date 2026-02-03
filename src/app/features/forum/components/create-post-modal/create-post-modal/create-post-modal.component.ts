import { 
  Component, 
  computed, 
  output, 
  model, 
  signal, 
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../services/forum.service';
import { ForumPost, PostCategory } from '../../../models/post.model';

// Pipes pures
import { ExcerptPipe } from '../../../pipes/Excerpt.pipe';
import { TagFilterPipe } from '../../../pipes/tag-filter.pipe';

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ExcerptPipe, TagFilterPipe],
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePostModalComponent {
  private forumService = inject(ForumService);

  // ====================
  // OUTPUTS (Events)
  // ====================
  readonly postCreated = output<ForumPost>();
  readonly cancel = output<void>();

  // ====================
  // MODEL (Two-way binding)
  // ====================
  readonly isVisible = model<boolean>(false);

  // ====================
  // SIGNALS (État réactif)
  // ====================
  private readonly titleState = signal<string>('');
  private readonly contentState = signal<string>('');
  private readonly selectedCategoryState = signal<string>('qna');
  private readonly tagsState = signal<string[]>([]);
  private readonly newTagInputState = signal<string>('');
  private readonly isSubmittingState = signal<boolean>(false);

  // ====================
  // COMPUTED (Valeurs dérivées)
  // ====================
  readonly title = computed(() => this.titleState().trim());
  readonly content = computed(() => this.contentState().trim());
  readonly selectedCategory = computed(() => this.selectedCategoryState());
  readonly tags = computed(() => [...this.tagsState()]);
  readonly newTagInput = computed(() => this.newTagInputState());
  readonly isSubmitting = computed(() => this.isSubmittingState());

  readonly canSubmit = computed(() => 
    this.title().length > 0 && 
    this.content().length > 0 && 
    !this.isSubmitting()
  );

  readonly characterCount = computed(() => ({
    current: this.titleState().length,
    max: 120,
    exceeded: this.titleState().length > 120
  }));

  readonly hasReachedTagLimit = computed(() => this.tags().length >= 5);

  // ====================
  // DONNÉES STATIQUES (Immuables)
  // ====================
  readonly CATEGORIES = [
    { value: 'workout', label: 'Workout Tips', icon: '💪', description: 'Share exercise routines and techniques' },
    { value: 'nutrition', label: 'Nutrition', icon: '🥗', description: 'Discuss diet, supplements, meal plans' },
    { value: 'progress', label: 'Progress & Goals', icon: '📈', description: 'Share achievements and set targets' },
    { value: 'motivation', label: 'Motivation', icon: '🔥', description: 'Stay inspired and motivated' },
    { value: 'qna', label: 'Q&A', icon: '❓', description: 'Ask questions, get answers' },
    { value: 'gear', label: 'Gear & Equipment', icon: '🏋️', description: 'Discuss fitness equipment and gear' },
    { value: 'recovery', label: 'Recovery', icon: '🧘', description: 'Rest, stretching, injury prevention' }
  ] as const;

  readonly SUGGESTED_TAGS = [
    'beginner', 'intermediate', 'advanced',
    'cardio', 'strength', 'flexibility',
    'weight-loss', 'muscle-gain', 'maintenance',
    'home-workout', 'gym', 'outdoor',
    'morning-routine', 'evening-workout',
    'high-protein', 'low-carb', 'vegetarian',
    'injury', 'form-check', 'plateau'
  ] as const;

  // ====================
  // HANDLERS PUBLICS
  // ====================
  updateTitle(value: string): void {
    if (value.length <= 120) {
      this.titleState.set(value);
    }
  }

  updateContent(value: string): void {
    this.contentState.set(value);
  }

  updateNewTagInput(value: string): void {
    this.newTagInputState.set(value);
  }

  selectCategory(category: string): void {
    this.selectedCategoryState.set(category);
  }

  addTag(tag?: string): void {
    const tagToAdd = (tag || this.newTagInput()).toLowerCase().trim();
    
    if (!tagToAdd || this.hasReachedTagLimit()) return;
    
    if (!this.tags().includes(tagToAdd)) {
      this.tagsState.update(tags => [...tags, tagToAdd]);
    }
    
    this.newTagInputState.set('');
  }

  addSuggestedTag(tag: string): void {
    if (this.hasReachedTagLimit() || this.tags().includes(tag)) return;
    this.tagsState.update(tags => [...tags, tag]);
  }

  removeTag(tagToRemove: string): void {
    this.tagsState.update(tags => tags.filter(tag => tag !== tagToRemove));
  }

onSubmit(): void {
  if (!this.canSubmit()) return;

  this.isSubmittingState.set(true);

  this.forumService.createPost({
    title: this.title(),
    content: this.content(),
    category: this.selectedCategory() as PostCategory,
    tags: [...this.tags()],
    userId: this.getCurrentUser().id
  }).subscribe({
    next: (createdPost) => {
      this.postCreated.emit(createdPost); // ✅ same output as before
      this.resetForm();
      this.isVisible.set(false);
      this.isSubmittingState.set(false);
    },
    error: (err) => {
      console.error('Failed to create post', err);
      this.isSubmittingState.set(false);
    }
  });
}


  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
    this.isVisible.set(false);
  }

  // ====================
  // MÉTHODES PRIVÉES
  // ====================


  private getCurrentUser() {
    return {
      id: 1,
      name: 'Rim',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      level: 1,
      badges: ['new-member']
    };
  }

  private resetForm(): void {
    this.titleState.set('');
    this.contentState.set('');
    this.selectedCategoryState.set('qna');
    this.tagsState.set([]);
    this.newTagInputState.set('');
    this.isSubmittingState.set(false);
  }

  // ====================
  // TRACKBY FUNCTIONS (Optimisation OnPush)
  // ====================
  trackByCategory(index: number, category: typeof this.CATEGORIES[number]): string {
    return category.value;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  trackBySuggestedTag(index: number, tag: string): string {
    return tag;
  }
}