# Dashboard & Analytics Feature

## Overview
This is the **Dashboard & Analytics** module for FitTracker, developed as part of Student 4's role. It provides comprehensive fitness tracking with visual charts, statistics, and progress monitoring.

## Features Implemented ✅

### 1. User Dashboard
- **Real-time Statistics Cards**: Display key metrics with trend indicators
  - Total Workouts
  - Calories Burned
  - Total Distance
  - Total Duration
- **Goal Progress Tracking**: Visual progress bars for weekly and monthly goals
- **Activity Breakdown**: Doughnut chart showing workout type distribution

### 2. Charts & Summaries
- **Weekly View**:
  - Line chart showing daily calories and duration trends
  - Activity type breakdown (doughnut chart)
  - Weekly summary with key statistics
  - Most active day highlighting
  
- **Monthly View**:
  - Bar chart displaying workouts and distance per week
  - Activity type distribution
  - Monthly summary with comprehensive metrics
  - Average workouts per week calculation

### 3. Interactive Components
- **View Toggle**: Switch between weekly and monthly analytics
- **Responsive Design**: Fully responsive layout for all screen sizes
- **Hover Effects**: Interactive stat cards with smooth animations
- **Trend Indicators**: Up/down arrows with percentage changes

## Technology Stack

### Frontend (Angular)
- **Angular 20.3.0**: Latest Angular framework
- **Chart.js**: Professional data visualization library
- **TypeScript**: Type-safe development
- **Standalone Components**: Modern Angular architecture
- **RxJS**: Reactive data management

### Components Created

#### Page Components
- `DashboardPageComponent`: Main dashboard container with data orchestration

#### Reusable Components
- `StatCardComponent`: Displays individual statistics with trends
- `LineChartComponent`: Line chart visualization wrapper
- `BarChartComponent`: Bar chart visualization wrapper
- `DoughnutChartComponent`: Doughnut/pie chart with custom legend

#### Services
- `DashboardService`: Data aggregation and business logic
  - `getDashboardStats()`: Fetch overall statistics
  - `getWeeklyWorkoutData()`: Weekly activity data
  - `getMonthlyWorkoutData()`: Monthly aggregated data
  - `getActivityBreakdown()`: Activity type distribution
  - `getWeeklySummary()`: Weekly performance summary
  - `getMonthlySummary()`: Monthly performance summary
  - `calculateTrend()`: Trend calculation helper

#### Models
- `DashboardStats`: Overall statistics interface
- `WorkoutData`: Individual workout data point
- `ChartData`: Chart configuration structure
- `ActivityBreakdown`: Activity type breakdown
- `WeeklySummary`: Weekly aggregated data
- `MonthlySummary`: Monthly aggregated data

## File Structure

```
src/app/features/dashboard/
├── components/
│   ├── stat-card/
│   │   └── stat-card.component.ts
│   ├── line-chart/
│   │   └── line-chart.component.ts
│   ├── bar-chart/
│   │   └── bar-chart.component.ts
│   └── doughnut-chart/
│       └── doughnut-chart.component.ts
├── models/
│   └── dashboard.model.ts
├── pages/
│   └── dashboard-page/
│       ├── dashboard-page.component.ts
│       ├── dashboard-page.component.html
│       ├── dashboard-page.component.css
│       └── dashboard-page.component.spec.ts
└── services/
    └── dashboard.service.ts
```

## Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install chart.js
   ```

2. **Run Development Server**
   ```bash
   npm start
   ```

3. **Access Dashboard**
   - Navigate to `http://localhost:4200/dashboard`
   - Dashboard is now the default landing page

## Integration Points

### Current Implementation (Mock Data)
The dashboard currently uses mock data from `DashboardService` to demonstrate functionality.

### Future Integration (Backend API)
To connect with NestJS backend:

1. **Update DashboardService** to use HttpClient:
   ```typescript
   constructor(private http: HttpClient) { }

   getDashboardStats(): Observable<DashboardStats> {
     return this.http.get<DashboardStats>('/api/dashboard/stats');
   }
   ```

2. **Expected API Endpoints** (NestJS - Student 4 Task):
   - `GET /api/dashboard/stats` - Overall statistics
   - `GET /api/dashboard/weekly` - Weekly workout data
   - `GET /api/dashboard/monthly` - Monthly aggregated data
   - `GET /api/dashboard/activity-breakdown` - Activity types
   - `GET /api/dashboard/summary/weekly` - Weekly summary
   - `GET /api/dashboard/summary/monthly` - Monthly summary

3. **SQL Server Views/Queries** (Student 4 Task):
   - Create aggregation views for efficient data retrieval
   - Implement date-based filtering
   - Calculate trends and percentages
   - Group data by week/month

## Data Models

### DashboardStats
```typescript
{
  totalWorkouts: number;
  totalCalories: number;
  totalDistance: number;
  totalDuration: number;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
}
```

### WorkoutData
```typescript
{
  date: string;
  workouts: number;
  calories: number;
  duration: number;
  distance: number;
}
```

## Styling & Design

- **Color Scheme**:
  - Primary Gradient: `#667eea` to `#764ba2`
  - Success (Positive Trend): `#10b981`
  - Error (Negative Trend): `#ef4444`
  - Chart Colors: Custom palette for each activity type

- **Typography**:
  - Headings: 700 weight, dark gray
  - Stats: 600-700 weight, large size
  - Labels: 500 weight, medium gray

- **Spacing**: Consistent 16-24px gaps for visual hierarchy

## Testing

Run unit tests:
```bash
npm test
```

Test coverage includes:
- Component creation
- Data loading
- Chart rendering
- View switching

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations
- Lazy loading for dashboard route
- Chart.js canvas rendering for smooth animations
- RxJS observables for efficient data streaming
- Component-level change detection

## Future Enhancements
- Export charts as images
- Date range picker for custom periods
- Comparison mode (current vs previous period)
- Real-time updates via WebSocket
- Personal records highlighting
- Social sharing capabilities

## Developer Notes
- All components use standalone architecture
- TypeScript strict mode enabled
- Follow Angular style guide conventions
- Mock data matches expected API response structure

## Contact & Support
For questions regarding the Dashboard & Analytics implementation, please contact the Student 4 team member or refer to the project documentation.

---

**Developed by**: Student 4 - Dashboard & Analytics Team  
**Last Updated**: January 27, 2026  
**Version**: 1.0.0
