import { Routes } from '@angular/router';
import { BodyMetricsComponent } from './features/body_metrics/components/body-metrics.component/body-metrics.component';
import { ProgressComponent } from './features/body_metrics/components/progress.component/progress.component';

export const routes: Routes = [
    { path: 'metrics', component: BodyMetricsComponent },
    { path: 'progress', component: ProgressComponent },
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
