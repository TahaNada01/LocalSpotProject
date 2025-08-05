import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { User } from '../../core/models/user.model';
import { Favorite } from '../../core/models/favorite.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  favorites: Favorite[] = [];

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data: User) => {
      this.user = data;
      this.username = '@' + (this.user.nom ? this.user.nom.toLowerCase().replace(/\s/g, '') : 'unknown');
      if (!this.user.ville) {
        this.user.ville = 'Unknown';
      }

      // Charger les favoris après avoir récupéré l'utilisateur
      this.loadFavorites();
    });
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (data: Favorite[]) => {
        this.favorites = data;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des favoris:', err);
      }
    });
  }

  deleteFavorite(placeId: string): void {
  this.favoritesService.deleteFavorite(placeId).subscribe({
    next: () => {
      this.favorites = this.favorites.filter(f => f.placeId !== placeId);
    },
    error: (err) => {
      console.error('Erreur lors de la suppression:', err);
    }
  });
}



  onSubmit(): void {
    const updatedUser = { ...this.user };

    if (this.newPassword.trim()) {
      updatedUser.motDePasse = this.newPassword;
    } else {
      delete updatedUser.motDePasse;
    }

    this.authService.updateUser(updatedUser).subscribe({
      next: () => {
        this.authService.getCurrentUser().subscribe((refreshedUser: User) => {
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
      error: (err: any) => {
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
