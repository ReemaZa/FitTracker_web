import { 
  Component, 
  input, 
  output, 
  ChangeDetectionStrategy,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { Comment } from '../../models/post.model';

@Component({
  selector: 'app-comment-thread',
  standalone: true,
  imports: [CommonModule, CommentCardComponent, CommentThreadComponent], // ⬅️ Récursif
  template: `
    <!-- Commentaire actuel -->
    <app-comment-card
      [comment]="comment()"
      [isPostAuthor]="isPostAuthor()"
      [showReplyForm]="showReplyFormFor() === comment().id"
      (likeComment)="likeComment.emit($event)"
      (replyToComment)="replyToComment.emit($event)"
      (markAsSolution)="markAsSolution.emit($event)"
      (replySubmitted)="onReplySubmitted($event)"
      (cancelReply)="cancelReply.emit()"
    />
    
    <!-- RÉCURSION : Gestion des réponses -->
    @if (shouldShowReplies()) {
      <div class="replies-container" [class.collapsed]="!isExpanded()">
        @for (reply of comment().replies!; track reply.id) {
          <app-comment-thread
            [comment]="reply"
            [depth]="depth() + 1"
            [isPostAuthor]="isPostAuthor()"
            [showReplyFormFor]="showReplyFormFor()"
            [isExpanded]="isExpanded()"
            (likeComment)="likeComment.emit($event)"
            (replyToComment)="replyToComment.emit($event)"
            (markAsSolution)="markAsSolution.emit($event)"
            (replySubmitted)="onReplySubmitted($event)"
            (cancelReply)="cancelReply.emit()"
          />
        }
      </div>
    }
    
    <!-- Bouton "Show/Hide replies" seulement si des réponses existent -->
    @if (hasReplies() ) {
      <div class="thread-controls">
        <button 
          class="show-replies-btn" 
          (click)="toggleExpansion()"
          [attr.aria-expanded]="isExpanded()"
        >
          <span class="material-icons-outlined icon-sm">
            {{ isExpanded() ? 'expand_less' : 'expand_more' }}
          </span>
          {{ isExpanded() ? 'Hide' : 'Show' }} {{ replyCountText() }}
        </button>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 16px;
    }
    
    .replies-container {
      margin-left: 48px;
      margin-top: 8px;
      padding-left: 16px;
      border-left: 2px solid #e5e7eb;
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .replies-container.collapsed {
      max-height: 0;
      opacity: 0;
      margin-top: 0;
      margin-bottom: 0;
      padding-top: 0;
      padding-bottom: 0;
      border-left-color: transparent;
    }
    
    .thread-controls {
      margin-top: 8px;
      padding-left: 56px; /* Alignement avec le commentaire */
    }
    
    .show-replies-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: none;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      color: #6b7280;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .show-replies-btn:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
      color: #374151;
    }
    
    /* Indentation progressive */
    .replies-container .replies-container {
      margin-left: 36px;
      border-left-color: #d1d5db;
    }
    
    .replies-container .replies-container .replies-container {
      margin-left: 24px;
      border-left-color: #9ca3af;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .replies-container {
        margin-left: 24px;
      }
      
      .thread-controls {
        padding-left: 32px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentThreadComponent {
  // ====================
  // INPUTS
  // ====================
  comment = input.required<Comment>();
  depth = input(0);
  isPostAuthor = input(false);
  showReplyFormFor = input<number | null>(null);
  isExpanded = input(true); // ⬅️ Contrôle d'expansion depuis le parent
  
  // ====================
  // OUTPUTS
  // ====================
  likeComment = output<number>();
  replyToComment = output<Comment>();
  markAsSolution = output<number>();
  replySubmitted = output<{parentCommentId: number, content: string}>();
  cancelReply = output<void>();
    // Handler pour expand après soumission
  onReplySubmitted(event: {parentCommentId: number, content: string}): void {
    // 1. Expand ce thread si la réponse lui est destinée
    if (event.parentCommentId === this.comment().id) {
      this.expandedState.set(true); // S'expand automatiquement
    }
    
    // 2. Propager l'événement vers le haut
    this.replySubmitted.emit(event);
  }
  // ====================
  // SIGNALS (État local)
  // ====================
  private expandedState = signal(false);
  
  // ====================
  // COMPUTED
  // ====================
  hasReplies = computed(() => {
    const replies = this.comment().replies;
  
    return replies && replies.length > 0;
  });
  
  replyCount = computed(() => {
    return this.comment().replies?.length || 0;
  });
  
  replyCountText = computed(() => {
    const count = this.replyCount();
    if (count === 1) return '1 reply';
    console.log("couuunt",count)
    return `${count} replies`;
  });
  
  shouldShowReplies = computed(() => {
    return this.hasReplies() && this.expandedState();
  });
  
  // ====================
  // HANDLERS
  // ====================
  toggleExpansion(): void {
    this.expandedState.update(v => !v);
    
  }
}