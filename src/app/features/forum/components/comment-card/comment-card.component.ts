import { 
  Component, 
  input, 
  output, 
  ChangeDetectionStrategy,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { Comment } from '../../models/post.model';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe],
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentCardComponent {
  // ====================
  // INPUTS
  // ====================
  comment = input.required<Comment>();
  isPostAuthor = input(true); // ← CORRIGÉ : false par défaut
  showReplyForm = input(false);
  showSolutionAction = input(true); // ← Déplacé avec les autres inputs
  
  // ====================
  // OUTPUTS
  // ====================
  likeComment = output<number>();
  replyToComment = output<Comment>();
  markAsSolution = output<number>();
  replySubmitted = output<{parentCommentId: number, content: string}>();
  cancelReply = output<void>();
  
  // ====================
  // SIGNALS (État local)
  // ====================
  replyContent = signal('');
  isSubmittingReply = signal(false);
  
  // ====================
  // COMPUTED
  // ====================
  canSubmitReply = computed(() => 
    this.replyContent().trim().length > 0 && !this.isSubmittingReply()
  );
  
  // NOUVEAU : Computed pour vérifier si on peut marquer comme solution
  canMarkAsSolution = computed(() => 
    this.isPostAuthor() && this.comment().parentCommentId==null &&
    //this.comment().isSolution && 
    this.showSolutionAction()
  );
  
  // ====================
  // HANDLERS
  // ====================
  onLike(): void {
    this.likeComment.emit(this.comment().id);
  }
  
  onReply(): void {
    this.replyToComment.emit(this.comment());
  }
  
  onMarkAsSolution(): void {
    this.markAsSolution.emit(this.comment().id);
  }
  
  onSubmitReply(): void {
    if (!this.canSubmitReply()) return;
    
    this.isSubmittingReply.set(true);
    
    // Ajouter automatiquement le tag @username si absent
    let content = this.replyContent().trim();
    const authorName = this.comment().author.name;
    
    if (!content.startsWith(`@${authorName}`)) {
      content = `@Andrew ${content}`;
    }
    
    this.replySubmitted.emit({
      parentCommentId: this.comment().id,
      content: content
    });
    
    // Réinitialiser
    this.replyContent.set('');
    this.isSubmittingReply.set(false);
  }
  
  onCancelReply(): void {
    this.replyContent.set('');
    this.cancelReply.emit();
  }
}