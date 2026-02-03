import { Injectable, signal, computed } from '@angular/core';
import { DailyGoalInstance } from '../models/daily-goal-instance.model';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DailyGoalService {

  private http = inject(HttpClient);
private readonly API_URL =
  'http://localhost:3001/goals/daily-goals/today';
private readonly TOGGLE_BINARY_URL =
  'http://localhost:3001/goals/instances';
private readonly INSTANCE_URL =
  'http://localhost:3001/goals/instances';

private _instances = signal<DailyGoalInstance[]>([]);

  // ✅ Expose as readonly
  dailyGoals = computed(() => this._instances());


  loadTodayGoals() {
  this.http
    .get<any[]>(this.API_URL, {
      headers: { 'x-user-id': '1' }
    })
    .pipe(
      map(items => items.map(i => this.mapBackendInstance(i)))
    )
    .subscribe(instances => {
      this._instances.set(instances);
    });
}


  // -----------------------
  // Numeric goals
  // -----------------------
increment(id: string) {
  const goal = this._instances().find(g => g.id === id);
  if (!goal || goal.metricType === 'binary') return;

  const value = this.getStep(goal);

  this.http
    .patch<any>(
      `${this.INSTANCE_URL}/${id}/increment`,
      { value },
      { headers: { 'x-user-id': '1' } }
    )
    .pipe(map(res => this.mapBackendInstance(res)))
    .subscribe(updated => {
      this._instances.update(list =>
        list.map(i => (i.id === updated.id ? updated : i))
      );
    });
}


decrement(id: string) {
  const goal = this._instances().find(g => g.id === id);
  if (!goal || goal.metricType === 'binary') return;

  const value = this.getStep(goal);

  this.http
    .patch<any>(
      `${this.INSTANCE_URL}/${id}/decrement`,
      { value },
      { headers: { 'x-user-id': '1' } }
    )
    .pipe(map(res => this.mapBackendInstance(res)))
    .subscribe(updated => {
      this._instances.update(list =>
        list.map(i => (i.id === updated.id ? updated : i))
      );
    });
}


 /* private update(id: string, delta: number) {
    this._instances.update(list =>
      list.map(g => {
        if (g.id !== id) return g;

        const value = Math.max(
          0,
          Math.min(g.targetValue, g.completedValue + delta)
        );

        return {
          ...g,
          completedValue: value,
          isCompleted: value >= g.targetValue
        };
      })
    );
  }*/

toggleBinary(instanceId: string) {
  return this.http
    .patch<any>(
      `${this.TOGGLE_BINARY_URL}/${instanceId}/toggle`,
      {},
      {
        headers: { 'x-user-id': '1' }
      }
    )
    .pipe(
      map(res => this.mapBackendInstance(res))
    )
    .subscribe(updated => {
      this._instances.update(list =>
        list.map(i => (i.id === updated.id ? updated : i))
      );
    });
}


  // -----------------------
  // Step rules
  // -----------------------
  private getStep(goal: DailyGoalInstance): number {
    if (goal.metricType === 'duration') {
      return goal.unit === 'hours' ? 0.25 : 5;
    }

    if (goal.metricType === 'volume') {
      return goal.unit === 'ml' ? 100 : 0.25;
    }

    return 1; // count
  }

private mapBackendInstance(i: any): DailyGoalInstance {
  return {
    id: String(i.id),
    goalId: String(i.goal.id),
    title: i.goal.title,
    description: i.goal.description ?? undefined,

    metricType: i.goal.metricType,
    unit: i.goal.unit,

    targetValue: i.targetValue,
    completedValue: i.completedValue,
    isCompleted: i.isCompleted,

    date: new Date(i.date)
  };
}

}
