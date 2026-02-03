export interface ForumUser {
  id: number;
  name: string;        // ← nom + prenom depuis le backend
  avatarUrl: string;   // ← image

}

export interface ForumPost {
  id: number;
  title: string;
  content: string;

  author: ForumUser;

  category: PostCategory;   // ← était string, maintenant strict
  tags: string[];

  likes: number;
  comments: number;         // ← à calculer côté frontend
  shares:number;
  pins:number;
  isPinned: boolean;
  isLiked: boolean;
  isShared:boolean;

  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

export type PostCategory =
  | 'fitness-tips'
  | 'nutrition'
  | 'motivation'
  | 'qna'
  | 'workout'
  | 'progress'
  | 'gear'
  | 'recovery';

export interface Comment {
  id: number;               // ← backend number
  content: string;

  author: ForumUser;

  postId: number;           // ← backend number (était string)
  parentCommentId?: number; // ← backend number | null

  createdAt: Date;
  likes: number;
  isSolution: boolean;

  replies?: Comment[];      // ← récursif OK
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: Date;
}
