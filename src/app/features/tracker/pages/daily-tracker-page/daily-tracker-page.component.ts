import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyGoalService } from '../../services/daily-goal.service';
import { DailyGoalCardComponent } from '../../components/daily-goal-card/daily-goal-card.component';

@Component({
  standalone: true,
  selector: 'app-daily-tracker-page',
  imports: [CommonModule, DailyGoalCardComponent],
  templateUrl: './daily-tracker-page.component.html',
  styleUrls: ['./daily-tracker-page.component.css']
})
export class DailyTrackerPageComponent {
  private service = inject(DailyGoalService);

  // ✅ readonly signal from service
  dailyGoals = this.service.dailyGoals;

    constructor() {
    this.service.loadTodayGoals();
  }

  increment(id: string) {
    this.service.increment(id);
  }

  decrement(id: string) {
    this.service.decrement(id);
  }

  toggleBinary(id: string) {
    this.service.toggleBinary(id);
  }
}
