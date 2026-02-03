import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Goal } from '../models/goal.model';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GoalsService {
  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:3001/goals';

  // 🔹 Internal mutable signal
  private _goals = signal<Goal[]>([]);

  // 🔹 Public readonly signal
  readonly goals = this._goals.asReadonly();

  // 🔹 Derived state
  readonly activeGoals = computed(() =>
    this._goals().filter(g => g.isActive)
  );

  // -------------------------
  // FETCH FROM BACKEND
  // -------------------------
loadGoals() {
  this.http
    .get<any[]>(this.API_URL, {
      headers: { 'x-user-id': '1' },
    })
    .pipe(
      map(goals =>
        goals.map(g => ({
          id: String(g.id),
          title: g.title,
          description: g.description ?? undefined,
          goalType: g.goalType,
          metricType: g.metricType,
          targetValue: g.targetValue,
          unit: g.unit,
          isActive: g.isActive,
          createdAt: new Date(g.createdAt),

          // 👇 map backend → frontend contract
          schedule: g.schedule
            ? {
                ...g.schedule,
                frequency: g.schedule.frequencyType,
              }
            : undefined,
        })),
      ),
    )
    .subscribe(goals => {
      this._goals.set(goals);
    });
}

  // -------------------------
  // CREATE GOAL (REAL API)
  // -------------------------
createGoal(goal: Goal) {
  const payload = {
    title: goal.title,
    description: goal.description ?? null,
    goalType: goal.goalType,
    metricType: goal.metricType,
    targetValue: goal.targetValue,
    unit: goal.unit,
    startDate: null,
    endDate: null,
    frequencyType: goal.schedule.frequency,
    daysOfWeek:
      goal.schedule.frequency === 'weekly'
        ? goal.schedule.daysOfWeek ?? []
        : []
  };

  return this.http
    .post<any>(this.API_URL, payload, {
      headers: {
        'x-user-id': '1',
        'Content-Type': 'application/json'
      }
    })
    .pipe(
      map(res => this.mapBackendGoal(res)), // ⬅️ returns Goal
      tap((createdGoal: Goal) => {
        this._goals.update(goals => [...goals, createdGoal]);
      })
    );
}

toggleGoal(id: string) {
  return this.http.patch<any>(
    `${this.API_URL}/${id}/toggle`,
    {},
    {
      headers: { 'x-user-id': '1' }
    }
  ).pipe(
    map(res => this.mapBackendGoal(res)),
    tap(updatedGoal => {
      this._goals.update(goals =>
        goals.map(g =>
          g.id === updatedGoal.id ? updatedGoal : g
        )
      );
    })
  );
}


  updateGoal(updated: Goal) {
    this._goals.update(goals =>
      goals.map(g => (g.id === updated.id ? updated : g))
    );
  }

  getGoalById(id: string) {
    return this._goals().find(g => g.id === id);
  }

deleteGoal(id: string) {
  return this.http.delete<void>(`${this.API_URL}/${id}`, {
    headers: { 'x-user-id': '1' }
  }).pipe(
    tap(() => {
      // remove from signal only after backend success
      this._goals.update(goals =>
        goals.filter(g => g.id !== id)
      );
    })
  );
}

// -------------------------
  // MAPPER (BACKEND → FRONTEND)
  // -------------------------
private mapBackendGoal(g: any): Goal {
  return {
    id: String(g.id),
    title: g.title,
    description: g.description ?? undefined,
    goalType: g.goalType,
    metricType: g.metricType,
    targetValue: g.targetValue,
    unit: g.unit,
    isActive: g.isActive,
    createdAt: new Date(g.createdAt),

    schedule: g.schedule
      ? {
          frequency: g.schedule.frequencyType,
          daysOfWeek: g.schedule.daysOfWeek ?? []
        }
      : {
          frequency: 'daily'
        }
  };
}


}
