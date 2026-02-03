import {
  Component,
  computed,
  effect,
  inject,
  DestroyRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsService } from '../../services/goals.service';
import { GoalListComponent } from '../../components/goal-list/goal-list.component';
import { GoalFormComponent } from '../../components/goal-form/goal-form.component';
import { Goal } from '../../models/goal.model';
import { DrawerMode } from '../../models/goals-ui-state.model';
@Component({ standalone: true, selector: 'app-goals-page', imports: [CommonModule, GoalListComponent, GoalFormComponent], templateUrl: './goals-page.component.html', styleUrls: ['./goals-page.component.css'] })
export class GoalsPageComponent {
  private goalsService = inject(GoalsService);
  private destroyRef = inject(DestroyRef);


drawerState = signal<DrawerMode>({ mode: 'closed' });

isDrawerOpen = computed(() => this.drawerState().mode !== 'closed');


  goals = this.goalsService.goals;



  constructor() {
    // Fetch goals once when page is created
    this.goalsService.loadGoals();
    console.log(this.goals());
    // Debug / teaching purpose
    effect(() => {
      console.log('Goals updated:', this.goals());
    });

    this.destroyRef.onDestroy(() => {
      console.log('GoalsPage destroyed');
    });
  }
  // ---------- UI actions ----------

  openCreate() {
  this.drawerState.set({ mode: 'create' });
  }



  closeDrawer() {
  this.drawerState.set({ mode: 'closed' });
  }

   onCreateGoal(goal: Goal) {
    this.goalsService.createGoal(goal).subscribe({
      next: () => this.closeDrawer(),
      error: err => console.error('Create goal failed', err)
    });
  }

  onToggleGoal(id: string) {
  this.goalsService.toggleGoal(id).subscribe();
  }
  onDeleteGoal(id: string) {
    this.goalsService.deleteGoal(id).subscribe();
  }

}
