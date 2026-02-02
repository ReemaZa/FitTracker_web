import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [class.trend-positive]="trend !== undefined && trend > 0" [class.trend-negative]="trend !== undefined && trend < 0">
      <div class="stat-icon">
        <span>{{ icon }}</span>
      </div>
      <div class="stat-content">
        <div class="stat-label">{{ label }}</div>
        <div class="stat-value">{{ value }} <span class="stat-unit">{{ unit }}</span></div>
        <div class="stat-trend" *ngIf="trend !== undefined && trend !== null">
          <span class="trend-icon">{{ trend >= 0 ? '↑' : '↓' }}</span>
          <span class="trend-value">{{ Math.abs(trend) | number: '1.0-1' }}%</span>
          <span class="trend-label">vs last {{ period }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }

    .stat-unit {
      font-size: 16px;
      font-weight: 400;
      color: #6b7280;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
    }

    .trend-icon {
      font-size: 16px;
      font-weight: bold;
    }

    .trend-value {
      font-weight: 600;
    }

    .trend-label {
      color: #6b7280;
    }

    .trend-positive .trend-icon,
    .trend-positive .trend-value {
      color: #10b981;
    }

    .trend-negative .trend-icon,
    .trend-negative .trend-value {
      color: #ef4444;
    }
  `]
})
export class StatCardComponent {
  @Input() icon: string = '📊';
  @Input() label: string = '';
  @Input() value: string | number = 0;
  @Input() unit: string = '';
  @Input() trend?: number;
  @Input() period: string = 'week';

  Math = Math;
}
