# Backend Integration Guide - Student 4 Dashboard & Analytics

## NestJS API Endpoints to Implement

### 1. Dashboard Statistics Endpoint
**Endpoint**: `GET /api/dashboard/stats?userId={userId}`

**Query Parameters:**
- `userId` (required): The ID of the user

**⚠️ IMPORTANT - Daily Goal Instance Filtering:**
When calculating stats from the `dailyGoalInstance` table, you MUST add:
```sql
WHERE isGoalActive = true
```
This ensures only active goals are included (users can activate/deactivate goals).

**Response Example**:
```json
{
  "totalWorkouts": 42,
  "totalCalories": 15420,
  "totalDistance": 156.8,
  "totalDuration": 2140,
  "weeklyGoalProgress": 75,
  "monthlyGoalProgress": 68
}
```

**SQL Query Example**:
```sql
-- Aggregation for dashboard stats
SELECT 
  COUNT(*) as totalWorkouts,
  SUM(calories) as totalCalories,
  SUM(distance) as totalDistance,
  SUM(duration) as totalDuration,
  -- Calculate weekly progress (current week / goal)
  (COUNT(CASE WHEN workout_date >= DATEADD(week, -1, GETDATE()) THEN 1 END) * 100.0 / 12) as weeklyGoalProgress,
  -- Calculate monthly progress (current month / goal)
  (COUNT(CASE WHEN workout_date >= DATEADD(month, -1, GETDATE()) THEN 1 END) * 100.0 / 50) as monthlyGoalProgress
FROM workouts
WHERE user_id = @userId
  AND workout_date >= DATEADD(month, -1, GETDATE());
```

---

### 2. Weekly Workout Data Endpoint
**Endpoint**: `GET /api/dashboard/weekly`

**Response Example**:
```json
[
  {
    "date": "2026-01-21",
    "workouts": 2,
    "calories": 540,
    "duration": 65,
    "distance": 8.5
  },
  {
    "date": "2026-01-22",
    "workouts": 1,
    "calories": 320,
    "duration": 45,
    "distance": 5.2
  }
  // ... for last 7 days
]
```

**SQL Query Example**:
```sql
-- Weekly workout data (last 7 days)
SELECT 
  CAST(workout_date as DATE) as date,
  COUNT(*) as workouts,
  SUM(calories) as calories,
  SUM(duration) as duration,
  SUM(distance) as distance
FROM workouts
WHERE user_id = @userId
  AND workout_date >= DATEADD(day, -7, GETDATE())
GROUP BY CAST(workout_date as DATE)
ORDER BY date;
```

---

### 3. Monthly Workout Data Endpoint
**Endpoint**: `GET /api/dashboard/monthly`

**Response Example**:
```json
[
  {
    "date": "Week 1",
    "workouts": 8,
    "calories": 2340,
    "duration": 310,
    "distance": 38.5
  },
  {
    "date": "Week 2",
    "workouts": 12,
    "calories": 3450,
    "duration": 420,
    "distance": 52.3
  }
  // ... for last 4 weeks
]
```

**SQL Query Example**:
```sql
-- Monthly workout data aggregated by week
SELECT 
  'Week ' + CAST(DATEPART(week, workout_date) - DATEPART(week, DATEADD(month, -1, GETDATE())) + 1 as VARCHAR) as date,
  COUNT(*) as workouts,
  SUM(calories) as calories,
  SUM(duration) as duration,
  SUM(distance) as distance
FROM workouts
WHERE user_id = @userId
  AND workout_date >= DATEADD(month, -1, GETDATE())
GROUP BY DATEPART(week, workout_date)
ORDER BY DATEPART(week, workout_date);
```

---

### 4. Activity Breakdown Endpoint
**Endpoint**: `GET /api/dashboard/activity-breakdown`

**Response Example**:
```json
[
  {
    "type": "Running",
    "count": 15,
    "percentage": 36,
    "color": "#4CAF50"
  },
  {
    "type": "Cycling",
    "count": 12,
    "percentage": 29,
    "color": "#2196F3"
  }
  // ... other activity types
]
```

**SQL Query Example**:
```sql
-- Activity breakdown with percentages
WITH ActivityCounts AS (
  SELECT 
    activity_type as type,
    COUNT(*) as count
  FROM workouts
  WHERE user_id = @userId
    AND workout_date >= DATEADD(month, -1, GETDATE())
  GROUP BY activity_type
),
TotalActivities AS (
  SELECT SUM(count) as total FROM ActivityCounts
)
SELECT 
  ac.type,
  ac.count,
  CAST((ac.count * 100.0 / ta.total) as INT) as percentage,
  CASE ac.type
    WHEN 'Running' THEN '#4CAF50'
    WHEN 'Cycling' THEN '#2196F3'
    WHEN 'Swimming' THEN '#FF9800'
    WHEN 'Gym' THEN '#9C27B0'
    ELSE '#607D8B'
  END as color
FROM ActivityCounts ac
CROSS JOIN TotalActivities ta
ORDER BY ac.count DESC;
```

---

### 5. Weekly Summary Endpoint
**Endpoint**: `GET /api/dashboard/summary/weekly`

**Response Example**:
```json
{
  "weekNumber": 4,
  "weekRange": "Jan 21 - Jan 27, 2026",
  "totalWorkouts": 10,
  "totalCalories": 2720,
  "avgDuration": 51,
  "mostActiveDay": "Friday"
}
```

**SQL Query Example**:
```sql
-- Weekly summary
SELECT 
  DATEPART(week, GETDATE()) as weekNumber,
  FORMAT(DATEADD(day, -6, GETDATE()), 'MMM dd') + ' - ' + 
    FORMAT(GETDATE(), 'MMM dd, yyyy') as weekRange,
  COUNT(*) as totalWorkouts,
  SUM(calories) as totalCalories,
  AVG(duration) as avgDuration,
  (
    SELECT TOP 1 DATENAME(weekday, workout_date)
    FROM workouts
    WHERE user_id = @userId
      AND workout_date >= DATEADD(day, -7, GETDATE())
    GROUP BY DATENAME(weekday, workout_date), DATEPART(weekday, workout_date)
    ORDER BY COUNT(*) DESC
  ) as mostActiveDay
FROM workouts
WHERE user_id = @userId
  AND workout_date >= DATEADD(day, -7, GETDATE());
```

---

### 6. Monthly Summary Endpoint
**Endpoint**: `GET /api/dashboard/summary/monthly`

**Response Example**:
```json
{
  "month": "January",
  "year": 2026,
  "totalWorkouts": 42,
  "totalCalories": 15420,
  "totalDistance": 156.8,
  "avgWorkoutsPerWeek": 10.5,
  "topActivity": "Running"
}
```

**SQL Query Example**:
```sql
-- Monthly summary
SELECT 
  DATENAME(month, GETDATE()) as month,
  YEAR(GETDATE()) as year,
  COUNT(*) as totalWorkouts,
  SUM(calories) as totalCalories,
  SUM(distance) as totalDistance,
  COUNT(*) / 4.0 as avgWorkoutsPerWeek,
  (
    SELECT TOP 1 activity_type
    FROM workouts
    WHERE user_id = @userId
      AND workout_date >= DATEADD(month, -1, GETDATE())
    GROUP BY activity_type
    ORDER BY COUNT(*) DESC
  ) as topActivity
FROM workouts
WHERE user_id = @userId
  AND workout_date >= DATEADD(month, -1, GETDATE());
```

---

## NestJS Controller Structure

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('api/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@CurrentUser() user: any) {
    return this.dashboardService.getStats(user.id);
  }

  @Get('weekly')
  async getWeeklyData(@CurrentUser() user: any) {
    return this.dashboardService.getWeeklyWorkoutData(user.id);
  }

  @Get('monthly')
  async getMonthlyData(@CurrentUser() user: any) {
    return this.dashboardService.getMonthlyWorkoutData(user.id);
  }

  @Get('activity-breakdown')
  async getActivityBreakdown(@CurrentUser() user: any) {
    return this.dashboardService.getActivityBreakdown(user.id);
  }

  @Get('summary/weekly')
  async getWeeklySummary(@CurrentUser() user: any) {
    return this.dashboardService.getWeeklySummary(user.id);
  }

  @Get('summary/monthly')
  async getMonthlySummary(@CurrentUser() user: any) {
    return this.dashboardService.getMonthlySummary(user.id);
  }
}
```

---

## SQL Server Views (Optional but Recommended)

### View 1: Daily Workout Aggregates
```sql
CREATE VIEW vw_DailyWorkoutAggregates AS
SELECT 
  user_id,
  CAST(workout_date as DATE) as workout_date,
  COUNT(*) as workout_count,
  SUM(calories) as total_calories,
  SUM(duration) as total_duration,
  SUM(distance) as total_distance,
  AVG(duration) as avg_duration
FROM workouts
GROUP BY user_id, CAST(workout_date as DATE);
```

### View 2: Weekly Workout Aggregates
```sql
CREATE VIEW vw_WeeklyWorkoutAggregates AS
SELECT 
  user_id,
  DATEPART(year, workout_date) as year,
  DATEPART(week, workout_date) as week_number,
  COUNT(*) as workout_count,
  SUM(calories) as total_calories,
  SUM(duration) as total_duration,
  SUM(distance) as total_distance
FROM workouts
GROUP BY user_id, DATEPART(year, workout_date), DATEPART(week, workout_date);
```

### View 3: Activity Type Summary
```sql
CREATE VIEW vw_ActivityTypeSummary AS
SELECT 
  user_id,
  activity_type,
  COUNT(*) as activity_count,
  SUM(calories) as total_calories,
  SUM(distance) as total_distance,
  AVG(duration) as avg_duration
FROM workouts
GROUP BY user_id, activity_type;
```

---

## Database Schema Requirements

Ensure your `workouts` table has these columns:
```sql
CREATE TABLE workouts (
  id INT PRIMARY KEY IDENTITY(1,1),
  user_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  workout_date DATETIME NOT NULL,
  duration INT NOT NULL, -- in minutes
  calories INT NOT NULL,
  distance DECIMAL(10,2), -- in kilometers
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_workouts_user_date ON workouts(user_id, workout_date);
CREATE INDEX idx_workouts_activity ON workouts(user_id, activity_type);
```

---

## Testing Your API

Use these sample requests to test your endpoints:

```bash
# Get dashboard stats
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/dashboard/stats

# Get weekly data
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/dashboard/weekly

# Get monthly data
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/dashboard/monthly

# Get activity breakdown
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/dashboard/activity-breakdown

# Get weekly summary
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/dashboard/summary/weekly

# Get monthly summary
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/dashboard/summary/monthly
```

---

## Notes for Student 4
1. Implement proper error handling in NestJS
2. Add input validation for user IDs
3. Consider caching frequently accessed aggregations
4. Add pagination if dataset grows large
5. Implement proper logging for debugging
6. Write unit tests for service methods
7. Document API with Swagger/OpenAPI

---

**Status**: Angular frontend complete ✅  
**Next Steps**: Implement NestJS backend and SQL Server queries  
**Priority**: High - Required for full dashboard functionality
