import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Goal } from '../../models/goal.model';
import { GoalCardComponent } from '../goal-card/goal-card.component';

@Component({
  standalone: true,
  selector: 'app-goal-list',
  imports: [CommonModule, GoalCardComponent],
  templateUrl: './goal-list.component.html'
})
export class GoalListComponent {
  @Input({ required: true }) goals!: Goal[];
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  // Template-safe forwarder: templates may infer a different event type
  // (e.g. DOM "toggle" event). Use this method to accept any and
  // re-emit with the correct strongly-typed payload.
  onToggle(event: unknown) {
    this.toggle.emit(event as string);
  }

}
