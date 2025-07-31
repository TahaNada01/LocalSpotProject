import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PlaceService } from '../../core/services/places.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ville: string = 'Paris';
  type: string = 'bar';
  places: any[] = [];

  constructor(private placeService: PlaceService) {}

  ngOnInit(): void {
    this.chargerLieux();
  }

  chargerLieux(): void {
  this.placeService.getPlaces(this.ville, this.type).subscribe({
    next: (data) => {
      console.log('Première page :', data);
      this.places = data.results;

      if (data.next_page_token) {
        setTimeout(() => {
          this.placeService.getNextPage(data.next_page_token).subscribe({
            next: (nextData) => {
              console.log('Deuxième page :', nextData);
              this.places = [...this.places, ...nextData.results];
            }
          });
        }, 2000); // délai obligatoire imposé par Google
      }
    },
    error: (err) => {
      console.error('Erreur lors du chargement des lieux', err);
    }
  });
}


  getPhotoUrl(photoReference: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${environment.googleApiKey}`;
  }

  toggleFavorite(place: any): void {
  place.favorite = !place.favorite;
  // on pourras ensuite sauvegarder en base de données ou localStorage ici
  }



}
