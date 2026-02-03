import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'goals',
    loadChildren: () => import('./features/goals/goals.routes')
      .then(m => m.goalsRoutes)
  },
    {
    path: 'tracker',
    loadChildren: () => import('./features/tracker/tracker.routes')
      .then(m => m.trackerRoutes)
  }
];
