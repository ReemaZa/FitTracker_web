import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './shared/components/app-header/app-header';
import { AppSidebar } from './shared/components/app-sidebar/app-sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeader, AppSidebar],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('fittracker-web');
}
