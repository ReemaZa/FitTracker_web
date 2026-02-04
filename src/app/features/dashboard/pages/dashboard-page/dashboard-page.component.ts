import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { DoughnutChartComponent } from '../../components/doughnut-chart/doughnut-chart.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { DashboardService } from '../../services/dashboard.service';
import {
  DashboardStats,
  WorkoutData,
  ActivityBreakdown,
  WeeklySummary,
  MonthlySummary
} from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    LineChartComponent,
    BarChartComponent,
    DoughnutChartComponent,
    StatCardComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
  stats: DashboardStats | null = null;
  weeklyData: WorkoutData[] = [];
  monthlyData: WorkoutData[] = [];
  activityBreakdown: ActivityBreakdown[] = [];
  weeklySummary: WeeklySummary | null = null;
  monthlySummary: MonthlySummary | null = null;

  // Loading states
  isLoadingStats = false;
  isLoadingCharts = false;
  isLoadingSummary = false;
  
  // Error states
  statsError: string | null = null;
  chartsError: string | null = null;
  summaryError: string | null = null;

  // Chart data
  weeklyChartLabels: string[] = [];
  weeklyChartDatasets: any[] = [];
  monthlyChartLabels: string[] = [];
  monthlyChartDatasets: any[] = [];
  activityLabels: string[] = [];
  activityData: number[] = [];
  activityColors: string[] = [];

  selectedView: 'weekly' | 'monthly' = 'weekly';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load stats
    this.isLoadingStats = true;
    this.statsError = null;
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.stats = stats;
        this.isLoadingStats = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.statsError = 'Failed to load dashboard statistics';
        this.isLoadingStats = false;
        console.error('Error loading stats:', error);
      }
    });

    // Load weekly data
    this.isLoadingCharts = true;
    this.chartsError = null;
    
    this.dashboardService.getWeeklyWorkoutData().subscribe({
      next: (data: WorkoutData[]) => {
        this.weeklyData = data;
        this.prepareWeeklyChart();
        this.isLoadingCharts = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.chartsError = 'Failed to load workout data';
        this.isLoadingCharts = false;
        console.error('Error loading weekly data:', error);
      }
    });

    // Load monthly data
    this.dashboardService.getMonthlyWorkoutData().subscribe({
      next: (data: WorkoutData[]) => {
        this.monthlyData = data;
        this.prepareMonthlyChart();
      },
      error: (error: any) => {
        this.chartsError = 'Failed to load monthly data';
        console.error('Error loading monthly data:', error);
      }
    });

    // Load activity breakdown
    this.dashboardService.getActivityBreakdown().subscribe({
      next: (activities: ActivityBreakdown[]) => {
        this.activityBreakdown = activities;
        this.prepareActivityChart();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.chartsError = 'Failed to load activity breakdown';
        console.error('Error loading activities:', error);
      }
    });

    // Load summaries
    this.isLoadingSummary = true;
    this.summaryError = null;
    
    this.dashboardService.getWeeklySummary().subscribe({
      next: (summary: WeeklySummary) => {
        this.weeklySummary = summary;
      },
      error: (error: any) => {
        this.summaryError = 'Failed to load weekly summary';
        console.error('Error loading weekly summary:', error);
      }
    });

    this.dashboardService.getMonthlySummary().subscribe({
      next: (summary: MonthlySummary) => {
        this.monthlySummary = summary;
        this.isLoadingSummary = false;
      },
      error: (error: any) => {
        this.summaryError = 'Failed to load monthly summary';
        this.isLoadingSummary = false;
        console.error('Error loading monthly summary:', error);
      }
    });
  }

  prepareWeeklyChart() {
    this.weeklyChartLabels = this.weeklyData.map((d: WorkoutData) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });

    this.weeklyChartDatasets = [
      {
        label: 'Calories Burned',
        data: this.weeklyData.map((d: WorkoutData) => d.calories),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ];
  }

  prepareMonthlyChart() {
    this.monthlyChartLabels = this.monthlyData.map((d: WorkoutData) => d.date);

    this.monthlyChartDatasets = [
      {
        label: 'Workouts',
        data: this.monthlyData.map((d: WorkoutData) => d.workouts),
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
        borderWidth: 1
      },
      {
        label: 'Distance (km)',
        data: this.monthlyData.map((d: WorkoutData) => d.distance),
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        borderWidth: 1
      }
    ];
  }

  prepareActivityChart() {
    this.activityLabels = this.activityBreakdown.map((a: ActivityBreakdown) => a.type);
    this.activityData = this.activityBreakdown.map((a: ActivityBreakdown) => a.percentage);
    this.activityColors = this.activityBreakdown.map((a: ActivityBreakdown) => a.color);
  }

  switchView(view: 'weekly' | 'monthly') {
    this.selectedView = view;
    this.loadDataForSelectedView();
  }

  loadDataForSelectedView() {
    if (this.selectedView === 'weekly') {
      this.isLoadingCharts = true;
      this.isLoadingSummary = true;
      
      this.dashboardService.getWeeklyWorkoutData().subscribe({
        next: (data: WorkoutData[]) => {
          this.weeklyData = data;
          this.prepareWeeklyChart();
          this.isLoadingCharts = false;
        },
        error: (error: any) => {
          this.chartsError = 'Failed to load weekly data';
          this.isLoadingCharts = false;
          console.error('Error:', error);
        }
      });
      
      this.dashboardService.getWeeklySummary().subscribe({
        next: (summary: WeeklySummary) => {
          this.weeklySummary = summary;
          this.isLoadingSummary = false;
        },
        error: (error: any) => {
          this.summaryError = 'Failed to load weekly summary';
          this.isLoadingSummary = false;
          console.error('Error:', error);
        }
      });
    } else {
      this.isLoadingCharts = true;
      this.isLoadingSummary = true;
      
      this.dashboardService.getMonthlyWorkoutData().subscribe({
        next: (data: WorkoutData[]) => {
          this.monthlyData = data;
          this.prepareMonthlyChart();
          this.isLoadingCharts = false;
        },
        error: (error: any) => {
          this.chartsError = 'Failed to load monthly data';
          this.isLoadingCharts = false;
          console.error('Error:', error);
        }
      });
      
      this.dashboardService.getMonthlySummary().subscribe({
        next: (summary: MonthlySummary) => {
          this.monthlySummary = summary;
          this.isLoadingSummary = false;
        },
        error: (error: any) => {
          this.summaryError = 'Failed to load monthly summary';
          this.isLoadingSummary = false;
          console.error('Error:', error);
        }
      });
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}
