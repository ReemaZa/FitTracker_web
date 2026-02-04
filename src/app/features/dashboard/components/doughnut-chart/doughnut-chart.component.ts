import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3 class="chart-title" *ngIf="title">{{ title }}</h3>
      <div class="chart-wrapper">
        <canvas #chartCanvas></canvas>
      </div>
      <div class="legend" *ngIf="showLegend">
        <div class="legend-item" *ngFor="let item of legendItems; let i = index">
          <span class="legend-color" [style.background-color]="item.color"></span>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ item.value }}%</span>
        </div>
      </div>
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

    .chart-wrapper {
      max-width: 300px;
      margin: 0 auto 20px;
    }

    canvas {
      max-height: 300px;
    }

    .legend {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }

    .legend-label {
      flex: 1;
      font-size: 14px;
      color: #374151;
    }

    .legend-value {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }
  `]
})
export class DoughnutChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() title: string = '';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];
  @Input() showLegend: boolean = true;

  private chart?: Chart;
  legendItems: any[] = [];

  ngOnInit() {
    this.prepareLegend();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['labels'] || changes['backgroundColor']) {
      this.prepareLegend();
      if (this.chartCanvas) {
        this.createChart();
      }
    }
  }

  private prepareLegend() {
    this.legendItems = this.labels.map((label, index) => ({
      label,
      value: this.data[index],
      color: this.backgroundColor[index]
    }));
  }

  private createChart() {
    if (!this.chartCanvas) return;

    // Destroy existing chart before creating new one
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.backgroundColor,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
