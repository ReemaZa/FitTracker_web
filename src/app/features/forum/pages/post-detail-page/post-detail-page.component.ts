import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Pipes
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { FormatStatsPipe } from '../../pipes/format-stats.pipe';
import { FormatCategoryPipe } from '../../pipes/format-category.pipe';

// Components
import { CommentCardComponent } from '../../components/comment-card/comment-card.component';
import { CommentThreadComponent } from '../../components/app-comment-thread/app-comment-thread.component';

// Services & Models
import { PostService } from '../../services/post.service';
import { Comment, ForumPost } from '../../models/post.model';
 import { effect } from '@angular/core';
@Component({
  selector: 'app-post-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TimeAgoPipe,
    FormatStatsPipe,
    FormatCategoryPipe,
    CommentCardComponent,
    CommentThreadComponent
  ],
  templateUrl: './post-detail-page.component.html',
  styleUrls: ['./post-detail-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostDetailPageComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);

  // ====================
  // SIGNALS
  // ====================
  post = signal<ForumPost | null>(null);
  comments = signal<Comment[]>([]);
  newComment = signal('');
  isLoading = signal(true);
  isSubmitting = signal(false);
  replyToComment = signal<Comment | null>(null);
   currentUserId=1;
  showReplyFormFor = signal<number | null>(null);

  // Toggle states
  isLiked = signal(false);
  isPinnedPost = signal(false);
  isShared = signal(false);

  // ====================
  // COMPUTED
  // ====================
  commentCount = computed(() => this.comments().length);

  canSubmitComment = computed(() =>
    this.newComment().trim().length > 0 && !this.isSubmitting()
  );

  topLevelComments = computed(() =>
    this.comments().filter(comment => !comment.parentCommentId)
  );

  isCurrentUserPostAuthor = computed(() => {
    const currentUserId = 1;
    return this.post()?.author.id === currentUserId;
  });



ngOnInit():void {
   const postId = Number(this.route.snapshot.paramMap.get('id'));
  this.postService.loadPostById(postId, this.currentUserId).subscribe({
    next: () => {
     
      this.post.update(() => this.postService._post);
      this.isLoading.update(() => this.postService._isLoading);
    },
    error: () => this.isLoading.update(() =>true)
  });

    this.postService.loadCommentsByPostId(postId).subscribe({
    next: () => this.comments.update(() => this.postService.comments),
    error: () => console.error('Error loading comments')
  });

}



  // ====================
  // LOAD MOCK DATA
  // ====================

  // ====================
  // POST TOGGLES
  // ====================
onLikePost(): void {
  const post = this.post();
  if (!post) return;

  const liked = post.isLiked;
  this.post.update(p => p ? { ...p, isLiked: !liked, likes: liked ? p.likes - 1 : p.likes + 1 } : p);

  const apiCall$ = liked
    ? this.postService.deleteReaction(1)
    : this.postService.addReaction(post.id, this.currentUserId, 'LIKE');

  apiCall$.subscribe({
    error: err => {
      console.error('Failed to toggle LIKE reaction', err);
      // rollback local state if needed
      this.post.update(p => p ? { ...p, isLiked: liked, likes: liked ? p.likes + 1 : p.likes - 1 } : p);
    }
  });
}

onTogglePin(): void {
  const post = this.post();
  if (!post) return;

  const pinned = post.isPinned;
  this.post.update(p => p ? { ...p, isPinned: !pinned, pins: pinned ? p.pins - 1 : p.pins + 1 } : p);

  const apiCall$ = pinned
    ? this.postService.deleteReaction(1)
    : this.postService.addReaction(post.id, this.currentUserId, 'PIN');

  apiCall$.subscribe({
    error: err => {
      console.error('Failed to toggle PIN reaction', err);
      this.post.update(p => p ? { ...p, isPinned: pinned, pins: pinned ? p.pins + 1 : p.pins - 1 } : p);
    }
  });
}

onSharePost(): void {
  const post = this.post();
  if (!post) return;

  const shared = post.isShared;
  this.post.update(p => p ? { ...p, isShared: !shared, shares: shared ? p.shares - 1 : p.shares + 1 } : p);

  const apiCall$ = shared
    ? this.postService.deleteReaction(1)
    : this.postService.addReaction(post.id, this.currentUserId, 'SHARE');

  apiCall$.subscribe({
    error: err => {
      console.error('Failed to toggle SHARE reaction', err);
      this.post.update(p => p ? { ...p, isShared: shared, shares: shared ? p.shares + 1 : p.shares - 1 } : p);
    }
  });
}


  // ====================
  // COMMENTS
  // ====================
onSubmitComment(): void {
  const post = this.post();
  if (!post || !this.canSubmitComment()) return;

  this.isSubmitting.set(true);

  this.postService.createComment({
    content: this.newComment(),
    userId: this.currentUserId,
    postId: post.id
    // no parentCommentId for top-level comments
  }).subscribe({
    next: (comment) => {
      // Add the new comment as a top-level comment
      this.comments.update(currentComments => [comment, ...currentComments]);

      // Clear input and flags
      this.newComment.set('');
      this.isSubmitting.set(false);

      // Update post comment count immutably
      this.post.update(post =>
        post ? { ...post, comments: post.comments + 1 } : post
      );

      // In zoneless environment, force UI update
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to create comment', err);
      this.isSubmitting.set(false);
    }
  });
}



  onLikeComment(commentId: number): void {
    this.comments.update(comments =>
      comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  }

  // ====================
  // REPLIES & HELPERS
  // ====================
  toggleReplyForm(commentId: number): void {
    this.showReplyFormFor.set(
      this.showReplyFormFor() === commentId ? null : commentId
    );
  }

  onMarkAsSolution(commentId: number): void {
    
  this.postService.markCommentAsSolution(commentId).subscribe({
    next: () => {
       this.comments.update(comments =>
      comments.map(comment => ({
        ...comment,
        isSolution: comment.id === commentId && !comment.isSolution
      }))
    );
    },
    error: err => {
      console.error('Failed to mark solution', err);
    }
  });
}

  
  

  getRepliesForComment(commentId: number): Comment[] {
    return this.comments().filter(c => c.parentCommentId === commentId);
  }

  hasReplies(commentId: number): boolean {
    return this.comments().some(c => c.parentCommentId === commentId);
  }

  
    onCancelReply(): void {
    this.replyToComment.set(null);
    this.showReplyFormFor.set(null);
  }

  // ====================
  // HELPER FUNCTIONS
  // ====================
  

  // ====================
  // HANDLERS
  // ====================

  
onReplySubmitted(event: { parentCommentId: number; content: string }): void {
  const post = this.post();
  if (!post) return;

  this.isSubmitting.set(true);

  this.postService
    .createComment({
      content: event.content,
      userId: 1,
      postId: post.id,
      parentCommentId: event.parentCommentId
    })
    .subscribe({
      next: (comment) => {
       this.comments.update(currentComments =>
    this.insertReplyBFS({ comments: currentComments, newComment: comment })
      // Manually notify Angular that the signal has changed
 
  );    // Manually trigger change detection since we're zoneless
        console.log(comment)
        console.log(this.comments())
        this.showReplyFormFor.set(null);
        this.isSubmitting.set(false);
      },
      error: err => {
        console.error('Failed to create reply', err);
        this.isSubmitting.set(false);
      }
    });
}


insertReplyBFS(params: { comments: Comment[]; newComment: Comment }): Comment[] {
  const { comments, newComment } = params;

  function bfsAndInsert(comments: Comment[]): Comment[] {
    return comments.map(c => {
      if (c.id === newComment.parentCommentId) {
        return {
          ...c,
          replies: [...(c.replies ?? []), { ...newComment, replies: [] }]
        };
      }
      return {
        ...c,
        replies: c.replies ? bfsAndInsert(c.replies) : []
      };
    });
  }

  return bfsAndInsert(comments);
}

// Helper function to replace a comment in the tree
 _replaceComment(comments: Comment[], targetId: number, updatedComment: Comment) {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === targetId) {
      comments[i] = updatedComment;
      return;
    }

    if ((comments[i].replies ?? []).length > 0) {
      this._replaceComment(comments[i].replies!, targetId, updatedComment);
    }
  }
}




  

  // Pour les réponses via le formulaire principal
  onReplyToComment(comment: Comment): void {
    this.replyToComment.set(comment);
    setTimeout(() => {
      document.getElementById('comment-input')?.focus();
    }, 100);
  }








 
  
}
 
