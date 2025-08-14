import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, shareReplay } from 'rxjs';
import { PlaceService } from '../../core/services/places.service';
import { Location } from '@angular/common';

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}
interface PlaceReview {
  author_name: string;
  rating: number;
  text?: string;
  relative_time_description?: string;
  profile_photo_url?: string;
}
interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  opening_hours?: { open_now?: boolean; weekday_text?: string[] };
  website?: string;
  international_phone_number?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types?: string[];
  photos?: PlacePhoto[];
  reviews?: PlaceReview[];
}

@Component({
  selector: 'app-place-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss'],
})
export class PlaceDetailsComponent {
  private route = inject(ActivatedRoute);
  places = inject(PlaceService);
  private location = inject(Location);

  place$: Observable<PlaceDetails> = this.route.paramMap.pipe(
    switchMap((p) => this.places.getPlaceDetails(p.get('placeId')!)),
    shareReplay(1)
  );

  euros(level?: number) {
    return level == null ? '—' : '€'.repeat(level + 1);
  }

  dirLink(p: PlaceDetails) {
    const { lat, lng } = p.geometry.location;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  getHeroUrl(place: PlaceDetails): string {
    const ref =
      place.photos && place.photos.length
        ? place.photos[0].photo_reference
        : undefined;
    return ref ? `url(${this.places.getPhotoUrl(ref, 1600)})` : 'none';
  }

  filteredTypes(types?: string[]): string[] {
    if (!types?.length) return [];
    const hide = new Set(['point_of_interest', 'establishment']);
    return types.filter((t) => !hide.has(t)).slice(0, 4);
  }

  goBack(): void {
    this.location.back();
  }
}
