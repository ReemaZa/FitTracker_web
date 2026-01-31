import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon'; //important for time scales
import { BodyMetricsHistoryService } from '../../services/body-metrics-history.service';
import { MOCK_USER } from '../../models/mock-user.model'; // mock user
import { DateTime } from 'luxon';


@Component({
  standalone: true,
  selector: 'app-progress',
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements AfterViewInit {
  metricsHistory: any[] = [];

  constructor(private historyService: BodyMetricsHistoryService) {}

  ngAfterViewInit() {
    // Initialize history after service is ready
    this.metricsHistory = this.historyService.getUserHistory(MOCK_USER.id);

    this.createBmiChart();
    this.createBodyFatChart();
    this.createBloodPressureChart();
    this.createPulseChart();
  }

  // -----------------------------
  // Helper: convert metrics to {x: DateTime, y: number} skipping nulls
  // -----------------------------
  private extractSeries(selector: (m: any) => number | null) {
    return this.metricsHistory
      .filter(m => selector(m) !== null)
      .map(m => ({
        x: DateTime.fromJSDate(m.recorded_at), // Luxon DateTime
        y: selector(m) as number
      }));
  }

  // -----------------------------
  // Generic chart creator
  // -----------------------------
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

  // -----------------------------
  // BMI
  // -----------------------------
  private createBmiChart() {
    const data = this.extractSeries(m => m.bmi);
    this.createLineChart('bmiChart', 'BMI', data, '#ff7fa3');
  }

  // -----------------------------
  // Body Fat
  // -----------------------------
  private createBodyFatChart() {
    const data = this.extractSeries(m => m.body_fat);
    this.createLineChart('fatChart', 'Body Fat %', data, '#a3d0ff');
  }

  // -----------------------------
  // Blood Pressure (dual line)
  // -----------------------------
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

  // -----------------------------
  // Pulse Rate
  // -----------------------------
  private createPulseChart() {
    const data = this.extractSeries(m => m.pulse_rate);
    this.createLineChart('pulseChart', 'Pulse Rate (bpm)', data, '#d780ff');
  }
}