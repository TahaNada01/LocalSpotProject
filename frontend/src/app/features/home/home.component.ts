import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PlaceService } from '../../core/services/places.service';
import { CategoriesService } from '../../core/services/categories.service';
import { environment } from '../../../environments/environment';
import { FiltersDrawerComponent } from '../filters/filters-drawer.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


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



  constructor(
    private placeService: PlaceService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    const savedCity = localStorage.getItem('ville');
    const savedType = localStorage.getItem('type');

    if (savedCity) this.ville = savedCity;
    if (savedType) this.type = savedType;

    this.categories = this.categoriesService.getCategories();
    this.chargerLieux();
  }

  chargerLieux(): void {
  this.isLoading = true; // Début du chargement
  localStorage.setItem('ville', this.ville);
  localStorage.setItem('type', this.type);

  this.placeService.getPlaces(this.ville, this.type).subscribe({
    next: (data) => {
      const firstPage = data.results;

      if (data.next_page_token) {
        // Petit délai avant la 2e page
        setTimeout(() => {
          this.placeService.getNextPage(data.next_page_token).subscribe({
            next: (nextData) => {
              const fullResults = [...firstPage, ...nextData.results];
              this.allPlaces = fullResults;
              this.places = [...this.allPlaces];

              if (this.searchTerm.trim()) {
                this.onSearch();
              }

              this.isLoading = false; // Fin du chargement
            },
            error: (err) => {
              console.error('Erreur lors du chargement de la 2e page', err);
              this.allPlaces = [...firstPage];
              this.places = [...this.allPlaces];
              this.isLoading = false; // Fin même en cas d'erreur
            }
          });
        }, 1500);
      } else {
        this.allPlaces = [...firstPage];
        this.places = [...this.allPlaces];

        if (this.searchTerm.trim()) {
          this.onSearch();
        }

        this.isLoading = false; // Fin du chargement
      }
    },
    error: (err) => {
      console.error('Erreur lors du chargement des lieux', err);
      this.isLoading = false; // Fin même en cas d’erreur
    }
  });
}



  onSearch(): void {
    const query = this.searchTerm.trim().toLowerCase();

    if (!query) {
      this.places = [...this.allPlaces]; // reset
      return;
    }

    this.places = this.allPlaces.filter(place =>
      place.name?.toLowerCase().includes(query) ||
      place.formatted_address?.toLowerCase().includes(query) ||
      place.types?.some((t: string) => t.includes(query))
    );
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
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${environment.googleApiKey}`;
  }

  toggleFavorite(place: any): void {
    place.favorite = !place.favorite;
  }

  resetFilters(): void {
    this.ville = 'Paris';
    this.type = 'bar';
    localStorage.removeItem('ville');
    localStorage.removeItem('type');
    this.chargerLieux();
  }

  onApplyFilters(filters: { city: string; type: string }): void {
  this.ville = filters.city.trim() || 'Paris'; // valeur par défaut
  this.type = filters.type || 'bar'; // valeur par défaut
  this.drawerOpen = false;
  this.chargerLieux();
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.places = [...this.allPlaces]; // reset affichage
  }



}
