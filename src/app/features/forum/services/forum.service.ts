import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ForumPost, ForumUser, PostCategory } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private readonly API_URL = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // ---------- Mapping backend → frontend ----------
  mapBackendPost(post: BackendPost): ForumPost {
    return {
      id: post.id,
      title: post.title,
      content: post.content,

      author: {
        name:post.author.nom,
        id:post.author.id,
        avatarUrl:"https://tse2.mm.bing.net/th/id/OIP.93Wp8WfWslensg04FkjK0gHaFn?w=922&h=700&rs=1&pid=ImgDetMain&o=7&rm=3"
      }, // compatible with ForumUser

      category: post.category as PostCategory,
      tags: post.tags,

      likes: post.likes,
      shares: post.shares,
      pins: post.pins,

      isPinned: post.isPinned,
      isLiked: post.isLiked,
      isShared: post.isShared,

      comments: 0, // calculated on frontend

      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      lastActivityAt: new Date(post.updatedAt)
    };
  }

  // ---------- API call ----------
  getPostsByUser(userId: number): Observable<ForumPost[]> {
    return this.http
      .get<BackendPost[]>(`${this.API_URL}/posts/${userId}`)
      .pipe(
        map(posts => posts.map(p => this.mapBackendPost(p)))
      );
  }
  createPost(payload: {
  title: string;
  content: string;
  category: PostCategory;
  tags: string[];
  userId: number;
}): Observable<ForumPost> {
  return this.http
    .post<BackendPost>(`${this.API_URL}/posts`, payload)
    .pipe(
      map(post => this.mapBackendPost(post))
    );
}
getPostsByCategory(category: PostCategory): Observable<ForumPost[]> {
  return this.http
    .get<BackendPost[]>(`${this.API_URL}/posts/category/${category}`)
    .pipe(
      map(posts => posts.map(post => this.mapBackendPost(post)))
    );
}


}

// Frontend type
export interface ForumUserBackend {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  // only the fields you actually need
}

// Backend type
export interface BackendPost {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  shares: number;
  pins: number;
  isPinned: boolean;
  isLiked: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
    author:ForumUserBackend
}

