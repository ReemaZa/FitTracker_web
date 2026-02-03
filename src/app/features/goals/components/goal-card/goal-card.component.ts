import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Goal } from '../../models/goal.model';

@Component({
  selector: 'app-goal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-card.component.html',
  styleUrls: ['./goal-card.component.css']
})
export class GoalCardComponent {
  @Input({ required: true }) goal!: Goal;

  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
}
