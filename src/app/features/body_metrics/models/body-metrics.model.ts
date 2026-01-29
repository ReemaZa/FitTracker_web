// body-metrics.model.ts
export interface BodyMetrics {
  gender?: 'male' | 'female';
  height_cm?: number;
  weight_kg?: number;
  waist?: number;
  neck?: number;
  hip?: number;
  systolic?: number;
  diastolic?: number;
  pulse_rate?: number;
}