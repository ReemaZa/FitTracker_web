import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BodyMetricsHistoryService {

  // Mock DB rows (same user_id)
  private history = [
    {
      user_id: '11111111-1111-1111-1111-111111111111',
      recorded_at: new Date('2024-12-01'),
      bmi: 27.4,
      body_fat: 32,
      systolic: 135,
      diastolic: 88,
      pulse_rate: 78
    },
    {
      user_id: '11111111-1111-1111-1111-111111111111',
      recorded_at: new Date('2025-01-01'),
      bmi: 26.8,
      body_fat: 30,
      systolic: 130,
      diastolic: 85,
      pulse_rate: 75
    },
    {
      user_id: '11111111-1111-1111-1111-111111111111',
      recorded_at: new Date('2025-02-01'),
      bmi: 25.9,
      body_fat: 28,
      systolic: 125,
      diastolic: 82,
      pulse_rate: 72
    },
      {
    user_id: '11111111-1111-1111-1111-111111111111',
    recorded_at: new Date('2025-02-15'),
    bmi: 25.9,
    body_fat: null,
    systolic: 125,
    diastolic: 82,
    pulse_rate: null
  },
  {
    user_id: '11111111-1111-1111-1111-111111111111',
    recorded_at: new Date('2025-03-01'),
    bmi: 24.8,
    body_fat: 22.4,
    systolic: null,
    diastolic: null,
    pulse_rate: 72
  }
  ];

  getUserHistory(userId: string) {
    return this.history.filter(h => h.user_id === userId);
  }
extractSeries<T extends number | null>(
    selector: (m: any) => T
  ) {
    return this.history
      .filter(m => selector(m) !== null)
      .map(m => ({
        x: m.recorded_at,
        y: selector(m) as number
      }));
  }
}
