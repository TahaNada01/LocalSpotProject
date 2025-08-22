import { Component, AfterViewInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

interface GooglePlace {
  displayName: { text: string };
  location: { latitude: number; longitude: number };
}

interface LocationInfo {
  name: string;
  address?: string;
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
  currentLocation: LocationInfo | null = null;
  isLoading = true;
  apiKey = environment.googleApiKey;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    const loader = new Loader({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    });

    loader.load().then(() => {
      this.initMap({ lat: 44.8378, lng: -0.5792 }); // Bordeaux par défaut
      this.isLoading = false;

      // Vérifie si un paramètre ?query=... est présent
      this.route.queryParams.subscribe(params => {
        const query = params['query'];
        if (query) {
          this.searchQuery = query;
          this.searchPlace();
        }
      });
    }).catch(error => {
      console.error('Error loading Google Maps:', error);
      this.isLoading = false;
    });
  }

  initMap(center: { lat: number; lng: number }) {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    this.map = new google.maps.Map(mapDiv, {
      center,
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false
    });

    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
      title: "Bordeaux",
      animation: google.maps.Animation.DROP
    });

    // Add click listener to map
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.updateMarker(event.latLng, 'Selected Location');
      }
    });
  }

  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.suggestions = [];
      return;
    }

    // Debounce search requests
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  private searchTimeout: any;

  private performSearch() {
    const url = `https://places.googleapis.com/v1/places:searchText`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': environment.googleApiKey,
      'X-Goog-FieldMask': 'places.displayName,places.location'
    });

    this.http.post<any>(url, {
      textQuery: this.searchQuery,
      languageCode: 'fr'
    }, { headers }).subscribe({
      next: (res) => {
        this.suggestions = res.places || [];
      },
      error: (err) => {
        console.error("Error searching places:", err);
        this.suggestions = [];
      }
    });
  }

  selectPlace(place: GooglePlace) {
    this.searchQuery = place.displayName.text;
    this.suggestions = [];

    const latLng = new google.maps.LatLng(place.location.latitude, place.location.longitude);
    this.updateMarker(latLng, place.displayName.text);
    
    // Update current location info
    this.currentLocation = {
      name: place.displayName.text
    };

    // Get address if possible
    this.getAddressFromCoords(place.location.latitude, place.location.longitude);
  }

  private updateMarker(position: google.maps.LatLng, title: string) {
    this.map.setCenter(position);
    this.map.setZoom(15);

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: title,
      animation: google.maps.Animation.DROP
    });
  }

  private getAddressFromCoords(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latLng = { lat, lng };

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results?.[0] && this.currentLocation) {
        this.currentLocation.address = results[0].formatted_address;
      }
    });
  }

  onEnter(event: Event) {
    event.preventDefault();
    
    if (this.suggestions.length > 0) {
      this.selectPlace(this.suggestions[0]);
    } else if (this.searchQuery.trim()) {
      this.searchPlace();
    }
  }

  searchPlace() {
    if (!this.searchQuery.trim()) return;

    const url = `https://places.googleapis.com/v1/places:searchText`;
    const body = {
      textQuery: this.searchQuery,
      languageCode: 'fr'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.location,places.formattedAddress'
    });

    this.http.post<any>(url, body, { headers }).subscribe({
      next: (response) => {
        const candidate = response.places?.[0];
        if (candidate && candidate.location) {
          const lat = candidate.location.latitude;
          const lng = candidate.location.longitude;
          const position = new google.maps.LatLng(lat, lng);
          
          this.updateMarker(position, candidate.displayName?.text || 'Found Location');
          
          // Update location info
          this.currentLocation = {
            name: candidate.displayName?.text || 'Found Location',
            address: candidate.formattedAddress
          };
        } else {
          // Show error message or fallback
          this.showNotFound();
        }
      },
      error: (error) => {
        console.error('Error searching place:', error);
        this.showNotFound();
      }
    });
  }

  private showNotFound() {
    // You could show a toast notification here
    console.log('Location not found');
  }

  clearSearch() {
    this.searchQuery = '';
    this.suggestions = [];
  }

  centerOnCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          this.map.setCenter(pos);
          this.map.setZoom(15);
          
          if (this.marker) {
            this.marker.setMap(null);
          }
          
          this.marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            title: "Your Location",
            animation: google.maps.Animation.DROP
          });

          this.currentLocation = {
            name: "Your Current Location"
          };

          this.getAddressFromCoords(pos.lat, pos.lng);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }

  toggleMapType() {
    const currentType = this.map.getMapTypeId();
    const newType = currentType === 'roadmap' ? 'satellite' : 'roadmap';
    this.map.setMapTypeId(newType);
  }
}