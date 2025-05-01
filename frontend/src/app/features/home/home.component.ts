import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#595959',
      confirmButtonText: 'Yes, log out',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
      }
    });
  }
  
}
