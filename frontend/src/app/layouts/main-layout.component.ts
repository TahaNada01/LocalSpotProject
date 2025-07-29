import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../features/sidebar/sidebar.component';
import { MapComponent } from '../features/map/map.component'; 

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet], 
  template: `
    <div class="main-layout">
      <app-sidebar></app-sidebar>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
    }
  `]
})
export class MainLayoutComponent {}
