import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import { BodyMetricsHistoryService, BodyMetricsHistoryItem } from '../../services/body-metrics-history.service';
import { DateTime } from 'luxon';

@Component({
  standalone: true,
  selector: 'app-progress',
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements AfterViewInit {
  metricsHistory: BodyMetricsHistoryItem[] = [];

  constructor(private historyService: BodyMetricsHistoryService) {}

  ngAfterViewInit() {
    this.loadHistory();
  }

  private loadHistory() {
    const userId = 2; // replace with dynamic user ID if needed

    this.historyService.getUserHistory(userId).subscribe({
      next: history => {
        this.metricsHistory = history.map(h => ({
          ...h,
        }));
          console.log('Loaded metricsHistory:', this.metricsHistory);
        this.createBmiChart();
        this.createBodyFatChart();
        this.createBloodPressureChart();
        this.createPulseChart();
      }
    });
  }

  private extractSeries(selector: (m: BodyMetricsHistoryItem) => number | null) {
    return this.metricsHistory
      .filter(m => selector(m) !== null)
      .map(m => ({
        x: m.recordedAt,
        y: selector(m) as number
      }));
  }

  private createLineChart(canvasId: string, label: string, data: any[], color: string) {
    if (!data.length) return;
    new Chart(canvasId, {
      type: 'line',
      data: { datasets: [{ label, data, borderColor: color, tension: 0.3, borderWidth: 2 }] },
      options: {
        responsive: true,
        parsing: { xAxisKey: 'x', yAxisKey: 'y' },
        scales: {
          x: { type: 'time', time: { unit: 'month' } },
          y: { beginAtZero: true }
        }
      }
    });
  }

  private createBmiChart() {
    const data = this.extractSeries(m => m.bmi);
    this.createLineChart('bmiChart', 'BMI', data, '#ff7fa3');
  }

  private createBodyFatChart() {
    const data = this.extractSeries(m => m.bodyFat);
    this.createLineChart('fatChart', 'Body Fat %', data, '#a3d0ff');
  }

  private createBloodPressureChart() {
    const systolic = this.extractSeries(m => m.systolic);
    const diastolic = this.extractSeries(m => m.diastolic);

    if (!systolic.length && !diastolic.length) return;

    new Chart('bpChart', {
      type: 'line',
      data: {
        datasets: [
          { label: 'Systolic', data: systolic, borderColor: '#ff9f80', tension: 0.3, borderWidth: 2 },
          { label: 'Diastolic', data: diastolic, borderColor: '#80c2ff', tension: 0.3, borderWidth: 2 }
        ]
      },
      options: {
        responsive: true,
        parsing: { xAxisKey: 'x', yAxisKey: 'y' },
        scales: {
          x: { type: 'time', time: { unit: 'month' } },
          y: { beginAtZero: true }
        }
      }
    });
  }

  private createPulseChart() {
    const data = this.extractSeries(m => m.pulseRate);
    this.createLineChart('pulseChart', 'Pulse Rate (bpm)', data, '#d780ff');
  }
}
