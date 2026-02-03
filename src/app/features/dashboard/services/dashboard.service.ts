import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { 
  DashboardStats, 
  WorkoutData, 
  ActivityBreakdown, 
  WeeklySummary, 
  MonthlySummary 
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;
  private useMockData = false; // Toggle this: false = use backend API, true = use mock data
  
  // Test user ID - replace with any user ID from your database
  private testUserId = 1; // Change this to match a user in your SQL Server database

  constructor(private http: HttpClient) { }

  // Helper method to handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error ${error.status}: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getDashboardStats(): Observable<DashboardStats> {
    if (!this.useMockData) {
      return this.http.get<DashboardStats>(`${this.apiUrl}/stats?userId=${this.testUserId}`).pipe(
        tap(data => console.log('Dashboard stats loaded:', data)),
        catchError(this.handleError)
      );
    }
    
    // Mock data - for development without backend
    const stats: DashboardStats = {
      totalWorkouts: 42,
      totalCalories: 15420,
      totalDistance: 156.8,
      totalDuration: 2140,
      weeklyGoalProgress: 75,
      monthlyGoalProgress: 68
    };
    return of(stats);
  }

  getWeeklyWorkoutData(): Observable<WorkoutData[]> {
    if (!this.useMockData) {
      return this.http.get<WorkoutData[]>(`${this.apiUrl}/weekly?userId=${this.testUserId}`).pipe(
        catchError(this.handleError)
      );
    }
    
    // Mock data for the last 7 days
    const data: WorkoutData[] = [
      { date: '2026-01-21', workouts: 2, calories: 540, duration: 65, distance: 8.5 },
      { date: '2026-01-22', workouts: 1, calories: 320, duration: 45, distance: 5.2 },
      { date: '2026-01-23', workouts: 0, calories: 0, duration: 0, distance: 0 },
      { date: '2026-01-24', workouts: 3, calories: 680, duration: 90, distance: 12.1 },
      { date: '2026-01-25', workouts: 1, calories: 290, duration: 40, distance: 4.8 },
      { date: '2026-01-26', workouts: 2, calories: 510, duration: 70, distance: 9.3 },
      { date: '2026-01-27', workouts: 1, calories: 380, duration: 50, distance: 6.5 }
    ];
    return of(data);
  }

  getMonthlyWorkoutData(): Observable<WorkoutData[]> {
    if (!this.useMockData) {
      return this.http.get<WorkoutData[]>(`${this.apiUrl}/monthly?userId=${this.testUserId}`).pipe(
        catchError(this.handleError)
      );
    }
    
    // Mock data for the last 30 days aggregated by week
    const data: WorkoutData[] = [
      { date: 'Week 1', workouts: 8, calories: 2340, duration: 310, distance: 38.5 },
      { date: 'Week 2', workouts: 12, calories: 3450, duration: 420, distance: 52.3 },
      { date: 'Week 3', workouts: 9, calories: 2680, duration: 360, distance: 41.7 },
      { date: 'Week 4', workouts: 13, calories: 3950, duration: 490, distance: 58.9 }
    ];
    return of(data);
  }

  getActivityBreakdown(): Observable<ActivityBreakdown[]> {
    if (!this.useMockData) {
      return this.http.get<ActivityBreakdown[]>(`${this.apiUrl}/activity-breakdown?userId=${this.testUserId}`).pipe(
        catchError(this.handleError)
      );
    }
    
    const activities: ActivityBreakdown[] = [
      { type: 'Running', count: 15, percentage: 36, color: '#4CAF50' },
      { type: 'Cycling', count: 12, percentage: 29, color: '#2196F3' },
      { type: 'Swimming', count: 8, percentage: 19, color: '#FF9800' },
      { type: 'Gym', count: 7, percentage: 16, color: '#9C27B0' }
    ];
    return of(activities);
  }

  getWeeklySummary(): Observable<WeeklySummary> {
    if (!this.useMockData) {
      return this.http.get<WeeklySummary>(`${this.apiUrl}/summary/weekly?userId=${this.testUserId}`).pipe(
        catchError(this.handleError)
      );
    }
    
    const summary: WeeklySummary = {
      weekNumber: 4,
      weekRange: 'Jan 21 - Jan 27, 2026',
      totalWorkouts: 10,
      totalCalories: 2720,
      avgDuration: 51,
      mostActiveDay: 'Friday'
    };
    return of(summary);
  }

  getMonthlySummary(): Observable<MonthlySummary> {
    if (!this.useMockData) {
      return this.http.get<MonthlySummary>(`${this.apiUrl}/summary/monthly?userId=${this.testUserId}`).pipe(
        catchError(this.handleError)
      );
    }
    
    const summary: MonthlySummary = {
      month: 'January',
      year: 2026,
      totalWorkouts: 42,
      totalCalories: 15420,
      totalDistance: 156.8,
      avgWorkoutsPerWeek: 10.5,
      topActivity: 'Running'
    };
    return of(summary);
  }

  // Method to calculate trend (positive/negative change)
  calculateTrend(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
}
