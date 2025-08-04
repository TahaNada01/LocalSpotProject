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
    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </div>
`,
styles: [`
  .main-layout {
    display: flex;
  }

  .content-area {
    margin-left: 250px;
    width: calc(100% - 250px);
    padding: 2rem;
  }
`]

})
export class MainLayoutComponent {}
