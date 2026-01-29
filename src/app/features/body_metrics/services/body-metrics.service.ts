import { Injectable } from '@angular/core';
import { BodyMetrics } from '../models/body-metrics.model';

@Injectable({ providedIn: 'root' })
export class BodyMetricsService {

  calculateBMI(heightCm: number, weightKg: number): number {
    const h = heightCm / 100;
    return +(weightKg / (h * h)).toFixed(1);
  }

  bmiStatus(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  calculateBodyFat(data: BodyMetrics): number | null {
    const { gender, waist, neck, hip, height_cm } = data;
    if (!gender || !waist || !neck || !height_cm) return null;

    if (gender === 'male') {
      return +(86.010 * Math.log10(waist - neck)
        - 70.041 * Math.log10(height_cm)
        + 36.76).toFixed(1);
    }

    if (gender === 'female' && hip) {
      return +(163.205 * Math.log10(waist + hip - neck)
        - 97.684 * Math.log10(height_cm)
        - 78.387).toFixed(1);
    }

    return null;
  }

  adviceBMI(bmi: number): string {
    if (bmi < 18.5) return 'Consider a nutrient-rich diet.';
    if (bmi < 25) return 'You are in a healthy range. Keep it up!';
    if (bmi < 30) return 'Small lifestyle changes can make a big difference.';
    return 'Medical guidance is recommended.';
  }

  bloodPressureAssessment(systolic: number, diastolic: number): string {
    if (systolic < 90 && diastolic < 60) return 'Low blood pressure. Monitor symptoms.';
    if (systolic < 120 && diastolic < 80) return 'Normal blood pressure.';
    if (systolic < 130 && diastolic < 80) return 'Elevated blood pressure. Consider lifestyle changes.';
    if (systolic < 140 || diastolic < 90) return 'High blood pressure (Hypertension Stage 1). Consult a doctor.';
    return 'High blood pressure (Hypertension Stage 2). Seek medical advice immediately.';
  }
    adviceBodyFat(bodyFat: number, gender: 'male' | 'female'): string {
    if (gender === 'male') {
      if (bodyFat < 6) return 'Body fat too low, consider increasing nutrition.';
      if (bodyFat < 25) return 'Healthy body fat range.';
      return 'High body fat, consider lifestyle changes.';
    } else {
      if (bodyFat < 16) return 'Body fat too low, consider increasing nutrition.';
      if (bodyFat < 32) return 'Healthy body fat range.';
      return 'High body fat, consider lifestyle changes.';
    }
  }
}
