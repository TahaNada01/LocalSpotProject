import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: 0,
    nom: '',
    email: '',
    ville: '',
    role: '',
    profilPhoto: '',
    motDePasse: '',
  };

  username = '';
  newPassword: string = '';
  activeTab: string = 'places';
  isEditing: boolean = false;


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data) => {
      this.user = data;
      console.log('User data:', data);

      // fallback si nom vide
      this.username = '@' + this.user.nom
        ? this.user.nom.toLowerCase().replace(/\s/g, '')
        : 'unknown';

      // fallback si ville vide
      if (!this.user.ville) {
        this.user.ville = 'Unknown';
      }
    });
  }

  onSubmit(): void {
    const updatedUser = { ...this.user };
  
    // N'envoie le mot de passe que si un nouveau a été saisi
    if (this.newPassword.trim()) {
      updatedUser.motDePasse = this.newPassword;
    } else {
      delete updatedUser.motDePasse; // n’envoie rien si vide
    }
  
    this.authService.updateUser(updatedUser).subscribe({
      next: () => {
        this.authService.getCurrentUser().subscribe((refreshedUser) => {
          this.user = refreshedUser;
          this.newPassword = '';
          this.isEditing = false;
  
          Swal.fire({
            icon: 'success',
            title: 'Profile updated',
            text: 'Your information has been saved successfully.',
            confirmButtonText: 'Close',
            confirmButtonColor: '#7c3aed'
          });
        });
      },
      error: (err) => {
        console.error('Update error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: err.error?.message || 'Could not update profile.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#7c3aed'
        });
      }
    });
  }
  
  
  
}
