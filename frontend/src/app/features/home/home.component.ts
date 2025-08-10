import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PlaceService } from '../../core/services/places.service';
import { CategoriesService } from '../../core/services/categories.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { environment } from '../../../environments/environment';
import { FiltersDrawerComponent } from '../filters/filters-drawer.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Favorite } from '../../core/models/favorite.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FiltersDrawerComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ville: string = 'Paris';
  type: string = 'bar';
  places: any[] = [];
  allPlaces: any[] = [];
  categories: any[] = [];
  drawerOpen: boolean = false;
  searchTerm: string = '';
  isLoading: boolean = false;
  favorites: Favorite[] = [];

  constructor(
    private placeService: PlaceService,
    private categoriesService: CategoriesService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedCity = localStorage.getItem('ville');
    const savedType = localStorage.getItem('type');

    if (savedCity) this.ville = savedCity;
    if (savedType) this.type = savedType;

    this.categories = this.categoriesService.getCategories();
    this.loadFavorites();
    this.chargerLieux();
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (data: Favorite[]) => {
        this.favorites = data;
        // On met à jour les lieux si déjà chargés
        this.places.forEach(place => {
          place.favorite = this.favorites.some(fav => fav.placeId === place.place_id);
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des favoris', err);
      }
    });
  }

  chargerLieux(): void {
    this.isLoading = true;
    localStorage.setItem('ville', this.ville);
    localStorage.setItem('type', this.type);

    this.placeService.getPlaces(this.ville, this.type).subscribe({
      next: (data) => {
        const firstPage = data.results;

        if (data.next_page_token) {
          setTimeout(() => {
            this.placeService.getNextPage(data.next_page_token).subscribe({
              next: (nextData) => {
                const fullResults = [...firstPage, ...nextData.results];
                this.allPlaces = fullResults;
                this.markFavorites();
                this.places = [...this.allPlaces];
                if (this.searchTerm.trim()) {
                  this.onSearch();
                }
                this.isLoading = false;
              },
              error: (err) => {
                console.error('Erreur lors du chargement de la 2e page', err);
                this.allPlaces = [...firstPage];
                this.markFavorites();
                this.places = [...this.allPlaces];
                this.isLoading = false;
              }
            });
          }, 1500);
        } else {
          this.allPlaces = [...firstPage];
          this.markFavorites();
          this.places = [...this.allPlaces];
          if (this.searchTerm.trim()) {
            this.onSearch();
          }
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des lieux', err);
        this.isLoading = false;
      }
    });
  }

  markFavorites(): void {
    this.allPlaces.forEach(place => {
      place.favorite = this.favorites.some(fav => fav.placeId === place.place_id);
    });
  }

  onSearch(): void {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      this.places = [...this.allPlaces];
      return;
    }
    this.places = this.allPlaces.filter(place =>
      place.name?.toLowerCase().includes(query) ||
      place.formatted_address?.toLowerCase().includes(query) ||
      place.types?.some((t: string) => t.includes(query))
    );
  }

  toggleFavorite(place: any): void {
    if (place.favorite) {
      this.favoritesService.deleteFavorite(place.place_id).subscribe({
        next: () => {
          place.favorite = false;
          this.loadFavorites(); //recharge la liste des favoris
        },
        error: (err) => {
          console.error('Erreur suppression favori :', err);
        }
      });
    } else {
      const newFavorite = {
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        photoReference: place.photos?.[0]?.photo_reference || '',
        rating: place.rating || null,
        openNow: place.opening_hours?.open_now ?? null
      };

      console.log(' Envoi du favori :', newFavorite);
      this.favoritesService.addFavorite(newFavorite).subscribe({
        next: () => {
          place.favorite = true;
          this.loadFavorites(); //recharge après ajout
        },
        error: (err) => {
          console.error('Erreur ajout favori :', err);
        }
      });
    }
  }


  onCategoryChange(newType: string): void {
    this.type = newType;
    this.chargerLieux();
  }

  onCityChange(newCity: string): void {
    this.ville = newCity;
    this.chargerLieux();
  }

  getPhotoUrl(photoReference: string): string {
  return this.placeService.getPhotoUrl(photoReference, 400);
  }


  resetFilters(): void {
    this.ville = 'Paris';
    this.type = 'bar';
    localStorage.removeItem('ville');
    localStorage.removeItem('type');
    this.chargerLieux();
  }

  onApplyFilters(filters: { city: string; type: string }): void {
    this.ville = filters.city.trim() || 'Paris';
    this.type = filters.type || 'bar';
    this.drawerOpen = false;
    this.chargerLieux();
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.places = [...this.allPlaces];
  }

  openDetails(placeId: string): void {
  this.router.navigate(['/places', placeId]);
  }



}
