export * from './app-sidebar.component';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-app-sidebar',
  standalone: true,

  imports: [RouterLinkActive, RouterLink],
  templateUrl: './app-sidebar.html',
  styleUrls: ['./app-sidebar.css'],
})
export class AppSidebar {

}
