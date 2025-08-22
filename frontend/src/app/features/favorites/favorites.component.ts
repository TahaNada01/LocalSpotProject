import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceCardComponent } from '../place-card/place-card.component'; // adapte le chemin si nécessaire
import { FavoritesService } from '../../core/services/favorites.service';
import { Favorite } from '../../core/models/favorite.model';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, PlaceCardComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  transformedFavorites: any[] = [];
  isLoadingFavorites = false;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoadingFavorites = true;
    this.favoritesService.getFavorites().subscribe({
      next: (data: Favorite[]) => {
        this.favorites = data;
        this.transformedFavorites = this.favorites.map(fav => ({
          name: fav.name,
          address: fav.address,
          photoReference: fav.photoReference,
          rating: fav.rating,
          opening_hours: {
            open_now: fav.openNow
          },
          placeId: fav.placeId
        }));
        this.isLoadingFavorites = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des favoris:', err);
        this.isLoadingFavorites = false;
      }
    });
  }

  getPhotoUrl(photoReference: string): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${environment.googleApiKey}`;
  }

  deleteFavorite(placeId: string): void {
    this.favoritesService.deleteFavorite(placeId).subscribe({
      next: () => {
        this.loadFavorites();
        Swal.fire({
          icon: 'success',
          title: 'Favorite deleted',
          text: 'The place has been removed from your favorites.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#7c3aed'
        });
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer ce lieu.',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#7c3aed'
        });
      }
    });
  }
}
