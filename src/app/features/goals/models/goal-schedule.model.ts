export type FrequencyType = 'daily' | 'weekly';

export interface GoalSchedule {
  frequency: FrequencyType;
  daysOfWeek?: number[]; // 0 = Sunday ... 6 = Saturday
}
