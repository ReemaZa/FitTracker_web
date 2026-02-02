import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page.component')
      .then(m => m.DashboardPageComponent)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];