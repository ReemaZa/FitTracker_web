import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-progress-bar',
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  @Input({ required: true }) value!: number;
  @Input({ required: true }) max!: number;

  get percent() {
    return Math.min(100, (this.value / this.max) * 100);
  }
}
