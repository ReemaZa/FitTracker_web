export interface DailyGoalInstance {
  id: string;
  goalId: string;
  title: string;
  description?: string;

  metricType: MetricType;
  unit: string;

  targetValue: number;
  completedValue: number;

  isCompleted: boolean;
  date: Date;
}
import { MetricType } from '../../goals/models/goal.types';