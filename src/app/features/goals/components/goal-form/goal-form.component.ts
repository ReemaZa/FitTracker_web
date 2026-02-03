import {
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';

import { Goal } from '../../models/goal.model';
import { METRIC_UNITS } from '../../models/metric-units';
import { GoalType, MetricType } from '../../models/goal.types';

@Component({
  standalone: true,
  selector: 'app-goal-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form-component.css']
})
export class GoalFormComponent {
  private fb = inject(FormBuilder);

  @Output() submitGoal = new EventEmitter<Goal>();

  // -----------------------------
  // FORM
  // -----------------------------
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    goalType: this.fb.nonNullable.control<GoalType>('walking'),

    metricType: this.fb.nonNullable.control<MetricType>('duration'),
    targetValue: this.fb.nonNullable.control(0, [
      Validators.required,
      positiveNumberValidator
    ]),
    unit: this.fb.nonNullable.control('minutes'),

    schedule: this.fb.nonNullable.group({
      frequency: this.fb.nonNullable.control<'daily' | 'weekly'>('daily'),
      daysOfWeek: this.fb.nonNullable.control<number[]>([])
    })
  });

  // -----------------------------
  // DAYS
  // -----------------------------
  readonly days = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 }
  ];

  // -----------------------------
  // SIGNALS (derived state)
  // -----------------------------
  frequency = signal<'daily' | 'weekly'>('daily');

  metricTypeSignal = signal<MetricType>(
    this.form.controls.metricType.value
  );

  metricType = computed(() => this.metricTypeSignal());

  isBinary = computed(() => this.metricType() === 'binary');

  availableUnits = computed(
    () => METRIC_UNITS[this.metricType()]
  );

  // -----------------------------
  // CONSTRUCTOR LOGIC
  // -----------------------------
  constructor() {
    // frequency → signal + reset days
    this.form.controls.schedule.controls.frequency.valueChanges.subscribe(
      freq => {
        this.frequency.set(freq);

        if (freq === 'daily') {
          this.form.controls.schedule.controls.daysOfWeek.setValue([]);
        }
      }
    );

    // metric → unit + binary handling
    this.form.controls.metricType.valueChanges.subscribe(metric => {
      this.metricTypeSignal.set(metric);

      if (metric === 'binary') {
        this.form.controls.targetValue.setValue(1);
        this.form.controls.unit.setValue('done');
      } else {
        const units = METRIC_UNITS[metric];
        this.form.controls.unit.setValue(units[0]);
      }
    });
  }

  // -----------------------------
  // WEEKDAY TOGGLE
  // -----------------------------
  toggleDay(day: number) {
    const ctrl = this.form.controls.schedule.controls.daysOfWeek;
    const current = ctrl.value;

    ctrl.setValue(
      current.includes(day)
        ? current.filter(d => d !== day)
        : [...current, day]
    );
  }

  isDaySelected(day: number): boolean {
    return this.form.controls.schedule.controls.daysOfWeek.value.includes(day);
  }

  // -----------------------------
  // SUBMIT (CREATE ONLY)
  // -----------------------------
  submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();

    const goal: Goal = {
      id: crypto.randomUUID(),
      title: value.title,
      description: value.description || undefined,
      goalType: value.goalType,
      metricType: value.metricType,
      targetValue: value.targetValue,
      unit: value.unit,
      schedule: {
        frequency: value.schedule.frequency,
        daysOfWeek:
          value.schedule.frequency === 'weekly'
            ? value.schedule.daysOfWeek
            : undefined
      },
      isActive: true,
      createdAt: new Date()
    };

    this.submitGoal.emit(goal);

    // reset form
    this.form.reset({
      title: '',
      description: '',
      goalType: 'walking',
      metricType: 'duration',
      targetValue: 0,
      unit: 'minutes',
      schedule: {
        frequency: 'daily',
        daysOfWeek: []
      }
    });

    this.frequency.set('daily');
  }
}

// -----------------------------
// VALIDATOR
// -----------------------------
function positiveNumberValidator(control: AbstractControl) {
  return control.value > 0 ? null : { positive: true };
}
