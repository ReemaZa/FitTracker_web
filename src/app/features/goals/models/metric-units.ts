import { MetricType } from './goal.types';

export const METRIC_UNITS: Record<MetricType, string[]> = {
  duration: ['minutes', 'hours'],
  distance: ['meters', 'kilometers', 'miles'],
  volume: ['ml', 'l'],
  count: ['times'],
  binary : ['done']
};
