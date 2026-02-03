import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-challenge-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './challenge-modal.component.html',
  styleUrls: ['./challenge-modal.component.css']
})
export class ChallengeModalComponent {
  @Output() startChallenge = new EventEmitter<{duration: number, type: string}>();
  @Output() cancel = new EventEmitter<void>();
  
  selectedDuration = 30;
  challengeType = 'mobility';
  showTimerOptions = false;
  
  durations = [
    { value: 15, label: '15 min - Quick Session' },
    { value: 30, label: '30 min - Standard' },
    { value: 45, label: '45 min - Extended' },
    { value: 60, label: '60 min - Advanced' }
  ];
  
  challengeTypes = [
    { value: 'mobility', label: 'Mobility & Stretching', icon: '🧘' },
    { value: 'strength', label: 'Strength Training', icon: '💪' },
    { value: 'cardio', label: 'Cardio', icon: '🏃' },
    { value: 'hiit', label: 'HIIT', icon: '⚡' },
    { value: 'yoga', label: 'Yoga', icon: '🕉️' },
    { value: 'core', label: 'Core Work', icon: '🔥' }
  ];
  
  onStart(): void {
    this.startChallenge.emit({
      duration: this.selectedDuration,
      type: this.challengeType
    });
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
  
  toggleTimer(): void {
    this.showTimerOptions = !this.showTimerOptions;
  }
}