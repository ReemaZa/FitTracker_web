import { Component, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BodyMetricsService, User, BodyMetricsDto } from '../../services/body-metrics.service';
import { humanHeight, humanWeight, humanCircumference, humanBloodPressure } from '../../validators/body-metrics.validators';

@Component({
  selector: 'app-body-metrics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './body-metrics.component.html',
  styleUrls: ['./body-metrics.component.css']
})
export class BodyMetricsComponent implements OnInit {
  form: FormGroup;

  // --- signals ---
  currentUser = signal<User | null>(null);

  // raw form signals
  heightCm = signal<number | null>(null);
  weightKg = signal<number | null>(null);
  waistCm = signal<number | null>(null);
  neckCm = signal<number | null>(null);
  hipCm = signal<number | null>(null);
  systolic = signal<number | null>(null);
  diastolic = signal<number | null>(null);
  pulseRate = signal<number | null>(null);

  saveMessage = signal('');

  // --- computed metrics ---
  bmi = computed(() => {
    const h = this.heightCm();
    const w = this.weightKg();
    return h && w ? this.metrics.calculateBMI(h, w) : null;
  });

  bmiStatus = computed(() => {
    const val = this.bmi();
    return val ? this.metrics.bmiStatus(val) : '';
  });

  bmiAdvice = computed(() => {
    const val = this.bmi();
    return val ? this.metrics.adviceBMI(val) : '';
  });

  bodyFat = computed(() => {
    const user = this.currentUser();
    if (!user) return null;

    return this.metrics.calculateBodyFat({
      gender: user.gender,
      height_cm: this.heightCm() ?? undefined,
      weight_kg: this.weightKg() ?? undefined,
      waist: this.waistCm() ?? undefined,
      neck: this.neckCm() ?? undefined,
      hip: this.hipCm() ?? undefined,
    });
  });

  bodyFatAdvice = computed(() => {
    const bf = this.bodyFat();
    const user = this.currentUser();
    return bf && user ? this.metrics.adviceBodyFat(bf, user.gender) : '';
  });

  bloodPressureAssessment = computed(() => {
    const s = this.systolic();
    const d = this.diastolic();
    return s && d ? this.metrics.bloodPressureAssessment(s, d) : '';
  });

  constructor(private fb: FormBuilder, private metrics: BodyMetricsService) {
    this.form = this.fb.group({
      height_cm: [null, [Validators.required, humanHeight]],
      weight_kg: [null, [Validators.required, humanWeight]],
      waist: [null, humanCircumference],
      neck: [null, humanCircumference],
      hip: [null, humanCircumference],
      systolic: [null],
      diastolic: [null],
      pulse_rate: [null]
    }, { validators: humanBloodPressure });
  }

  ngOnInit() {
    // Load user from backend
    this.metrics.getUserById(2).subscribe(user => {
      this.currentUser.set(user);
    });

    // Bind form values to signals
    this.form.valueChanges
      .pipe()
      .subscribe(v => {
        this.heightCm.set(v.height_cm);
        this.weightKg.set(v.weight_kg);
        this.waistCm.set(v.waist);
        this.neckCm.set(v.neck);
        this.hipCm.set(v.hip);
        this.systolic.set(v.systolic);
        this.diastolic.set(v.diastolic);
        this.pulseRate.set(v.pulse_rate);
      });
  }

  saveMetrics() {
    const user = this.currentUser();
    if (!user) return;

    const payload: BodyMetricsDto = {
  heightCm: this.heightCm()!,
  weightKg: this.weightKg()!,
  bmi: this.bmi()!,
  bodyFat: this.bodyFat() ?? undefined,
  recordedAt: new Date(),
  ...(this.waistCm() != null && { waistCm: this.waistCm()! }),
  ...(this.neckCm() != null && { neckCm: this.neckCm()! }),
  ...(this.hipCm() != null && { hipCm: this.hipCm()! }),
  ...(this.systolic() != null && { systolic: this.systolic()! }),
  ...(this.diastolic() != null && { diastolic: this.diastolic()! }),
  ...(this.pulseRate() != null && { pulseRate: this.pulseRate()! }),
};

    this.metrics.saveMetrics(user.id, payload).subscribe({
      next: () => {
        this.saveMessage.set('Metrics saved successfully!');
        setTimeout(() => this.saveMessage.set(''), 3000);
      },
      error: (err) => {
        console.error('Failed to save metrics', err);
        this.saveMessage.set('Failed to save metrics.');
        setTimeout(() => this.saveMessage.set(''), 3000);
      }
    });
  }
}
