import { Routes } from '@angular/router';


export const forumRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/forum-page/forum-page.component')
      .then(m => m.ForumPageComponent)
  },
 
  { 
    path: 'post/:id', 
    loadComponent: () => import('./pages/post-detail-page/post-detail-page.component')
      .then(m => m.PostDetailPageComponent)
  },
 
  
];