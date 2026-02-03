import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';

// Export this interface so other files can use it
export interface BodyMetricsHistoryItem {
  user_id: number;
  recordedAt: DateTime;
  bmi: number;
  bodyFat: number | null;
  systolic: number | null;
  diastolic: number | null;
  pulseRate: number | null;
}

@Injectable({ providedIn: 'root' })
export class BodyMetricsHistoryService {
  private baseUrl = 'http://localhost:3001'; // backend URL

  constructor(private http: HttpClient) {}

  // Return Observable from backend
  getUserHistory(userId: number): Observable<BodyMetricsHistoryItem[]> {
    return this.http.get<BodyMetricsHistoryItem[]>(`${this.baseUrl}/users/${userId}/metrics`);
  }

  extractSeries(items: BodyMetricsHistoryItem[], selector: (m: BodyMetricsHistoryItem) => number | null) {
    return items
      .filter(m => selector(m) !== null)
      .map(m => ({
        x: m.recordedAt,
        y: selector(m) as number
      }));
  }
}
