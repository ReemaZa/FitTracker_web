import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3 class="chart-title" *ngIf="title">{{ title }}</h3>
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .chart-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 16px;
    }

    canvas {
      max-height: 300px;
    }
  `]
})
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() title: string = '';
  @Input() labels: string[] = [];
  @Input() datasets: any[] = [];
  @Input() options: any = {};

  private chart?: Chart;

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && (changes['labels'] || changes['datasets'])) {
      this.updateChart();
    }
  }

  private createChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: this.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        ...this.options
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets = this.datasets;
      this.chart.update();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
