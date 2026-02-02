export interface DashboardStats {
  totalWorkouts: number;
  totalCalories: number;
  totalDistance: number;
  totalDuration: number;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
}

export interface WorkoutData {
  date: string;
  workouts: number;
  calories: number;
  duration: number;
  distance: number;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  tension?: number;
}

export interface ActivityBreakdown {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface WeeklySummary {
  weekNumber: number;
  weekRange: string;
  totalWorkouts: number;
  totalCalories: number;
  avgDuration: number;
  mostActiveDay: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalWorkouts: number;
  totalCalories: number;
  totalDistance: number;
  avgWorkoutsPerWeek: number;
  topActivity: string;
}
