import { Component, computed, effect, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BodyMetricsService } from '../../services/body-metrics.service';
import { humanHeight, humanWeight, humanCircumference, humanBloodPressure } from '../../validators/body-metrics.validators';
import { BodyMetrics } from '../../models/body-metrics.model';
import { debounceTime } from 'rxjs';
import { MOCK_USER } from '../../models/mock-user.model'; // mock user

@Component({
  selector: 'app-body-metrics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './body-metrics.component.html',
  styleUrls: ['./body-metrics.component.css']
})
export class BodyMetricsComponent {
  form: FormGroup;

    // Simulated logged-in user
  currentUser = MOCK_USER;

  // Live result signals
  bmi = signal<number | null>(null);
  bmiStatus = signal('');
  bmiAdvice = signal('');
  bodyFat = signal<number | null>(null);
  bodyFatAdvice = signal('');
  bloodPressureAssessment = signal('');
  saveMessage = signal('');

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

    this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe(() => this.updateResults());
  }

  private toBodyMetrics(): BodyMetrics {
    const v = this.form.value;
    return {
      height_cm: v.height_cm ?? undefined,
      weight_kg: v.weight_kg ?? undefined,
      waist: v.waist ?? undefined,
      neck: v.neck ?? undefined,
      hip: v.hip ?? undefined,
      systolic: v.systolic ?? undefined,
      diastolic: v.diastolic ?? undefined,
      pulse_rate: v.pulse_rate ?? undefined
    };
  }

  private updateResults() {
    const data = this.toBodyMetrics();

    // BMI
    if (data.height_cm && data.weight_kg) {
      const bmiVal = this.metrics.calculateBMI(data.height_cm, data.weight_kg);
      this.bmi.set(bmiVal);
      this.bmiStatus.set(this.metrics.bmiStatus(bmiVal));
      this.bmiAdvice.set(this.metrics.adviceBMI(bmiVal));
    } else {
      this.bmi.set(null);
      this.bmiStatus.set('');
      this.bmiAdvice.set('');
    }

    // Body fat — gender comes from USER
    const bf = this.metrics.calculateBodyFat({
      ...data,
      gender: this.currentUser.gender
    });

    this.bodyFat.set(bf);
    this.bodyFatAdvice.set(
      bf && this.currentUser.gender
        ? this.metrics.adviceBodyFat(bf, this.currentUser.gender)
        : ''
    );

    // Blood pressure
    if (data.systolic && data.diastolic) {
      this.bloodPressureAssessment.set(
        this.metrics.bloodPressureAssessment(data.systolic, data.diastolic)
      );
    } else {
      this.bloodPressureAssessment.set('');
    }
  }

  saveMetrics() {
    const payload = {
      user_id: this.currentUser.id,
      ...this.toBodyMetrics(),
      bmi: this.bmi(),
      body_fat: this.bodyFat(),
      recorded_at: new Date()
    };

    console.log('MOCK SAVE → backend', payload);

    setTimeout(() => {
      this.saveMessage.set('Metrics saved successfully!');
      setTimeout(() => this.saveMessage.set(''), 3000);
    }, 500);
  }
}