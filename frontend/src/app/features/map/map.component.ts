import { Component, AfterViewInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface GooglePlace {
  displayName: { text: string };
  location: { latitude: number; longitude: number };
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class MapComponent implements AfterViewInit {
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  searchQuery = '';
  suggestions: GooglePlace[] = [];
  apiKey = ''; 

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    const loader = new Loader({
      apiKey: this.apiKey,
      libraries: ['places']
    });

    loader.load().then(() => {
      this.initMap({ lat: 44.8378, lng: -0.5792 }); // Bordeaux par défaut
    });
  }

  initMap(center: { lat: number; lng: number }) {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    this.map = new google.maps.Map(mapDiv, {
      center,
      zoom: 13
    });

    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
      title: "Bordeaux"
    });
  }

  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.suggestions = [];
      return;
    }

    const url = `https://places.googleapis.com/v1/places:searchText`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.location'
    });

    this.http.post<any>(url, {
      textQuery: this.searchQuery,
      languageCode: 'fr'
    }, { headers }).subscribe(
      res => this.suggestions = res.places || [],
      err => console.error("Erreur Google:", err)
    );
  }

  selectPlace(place: GooglePlace) {
    this.searchQuery = place.displayName.text;
    this.suggestions = [];

    const latLng = new google.maps.LatLng(place.location.latitude, place.location.longitude);
    this.map.setCenter(latLng);
    this.map.setZoom(15);

    if (this.marker) this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: place.displayName.text
    });
  }

  onEnter(event: Event) {
  event.preventDefault();
  const keyboardEvent = event as KeyboardEvent;

  if (this.suggestions.length > 0) {
    this.selectPlace(this.suggestions[0]);
  } else {
    this.searchPlace();
  }
}
  searchPlace() {
  const url = `https://places.googleapis.com/v1/places:searchText`;
  const body = {
    textQuery: this.searchQuery,
    languageCode: 'fr'
  };

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': this.apiKey,
    'X-Goog-FieldMask': 'places.displayName,places.location'
  });

  this.http.post<any>(url, body, { headers }).subscribe(
    response => {
      const candidate = response.places?.[0];
      if (candidate && candidate.location) {
        const lat = candidate.location.latitude;
        const lng = candidate.location.longitude;

        const position = new google.maps.LatLng(lat, lng);
        this.map.setCenter(position);
        this.map.setZoom(15);

        if (this.marker) this.marker.setMap(null);

        this.marker = new google.maps.Marker({
          position,
          map: this.map,
          title: candidate.displayName?.text || 'Lieu trouvé'
        });
      } else {
        alert("Aucun résultat trouvé.");
      }
    },
    error => {
      console.error('Erreur lors de la recherche:', error);
    }
  );
}
  clearSearch() {
  this.searchQuery = '';
  this.suggestions = [];
}


}
