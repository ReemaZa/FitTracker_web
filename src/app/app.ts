import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebarComponent } from './shared/components/app-sidebar/app-sidebar.component';
import { AppHeaderComponent } from './shared/components/app-header/app-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSidebarComponent, AppHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fittracker-web');
}
