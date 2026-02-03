import { GoalSchedule } from './goal-schedule.model';
import { GoalType, MetricType } from './goal.types';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  goalType: GoalType;
  metricType: MetricType;
  targetValue: number;
  unit: string;
  schedule: GoalSchedule;

  isActive: boolean;
  createdAt: Date;
}
