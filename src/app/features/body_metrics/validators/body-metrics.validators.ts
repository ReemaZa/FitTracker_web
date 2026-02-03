import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const humanHeight: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = control.value;
  return v && (v < 50 || v > 272) ? { heightHuman: true } : null;
};

export const humanWeight: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = control.value;
  return v && (v < 2 || v > 650) ? { weightHuman: true } : null;
};

export const humanCircumference: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = control.value;
  return v && (v < 10 || v > 300) ? { circumferenceHuman: true } : null;
};

export const humanBloodPressure: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const s = group.get('systolic')?.value;
  const d = group.get('diastolic')?.value;
  const p = group.get('pulse_rate')?.value;
  if (!s || !d) return null;
  if (s < 70 || s > 250 || d < 40 || d > 150 || d >= s) {
    return { bloodPressureHuman: true };
  }
  if (p && (p < 30 || p > 220)) {
    return { pulseRateHuman: true };
  }
  return null;
};