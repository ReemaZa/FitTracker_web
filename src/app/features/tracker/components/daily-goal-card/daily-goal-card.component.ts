import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyGoalInstance } from '../../models/daily-goal-instance.model';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  standalone: true,
  selector: 'app-daily-goal-card',
  imports: [CommonModule, ProgressBarComponent],
  templateUrl: './daily-goal-card.component.html',
  styleUrls: ['./daily-goal-card.component.css']
})
export class DailyGoalCardComponent {
  @Input({ required: true }) goal!: DailyGoalInstance;

  @Output() increment = new EventEmitter<string>();
  @Output() decrement = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();

}
