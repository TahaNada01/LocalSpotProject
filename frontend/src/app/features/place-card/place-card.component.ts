import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss'],
})
export class PlaceCardComponent {
  constructor(private router: Router) {}

  @Input() place!: {
    name: string;
    address: string;
    photoReference?: string;
    opening_hours?: { open_now?: boolean };
    rating?: number;
    place_id?: string;
    placeId?: string;
  };

  @Input() isFavorite = false;
  @Input() showRemoveButton = false;

  @Output() remove = new EventEmitter<void>();

 
  get id(): string | null {
    return (this.place as any)?.place_id ?? (this.place as any)?.placeId ?? null;
  }

  get link(): any[] | null {
    return this.id ? ['/places', this.id] : null; 
  }

  getPhotoUrl(): string {
    return this.place.photoReference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${this.place.photoReference}&key=${environment.googleApiKey}`
      : '';
  }

  goToDetails(evt?: Event) {
    if (evt) evt.preventDefault();
    if (this.link) this.router.navigate(this.link);
  }

 
  onToggleFavorite(evt?: Event): void {
    if (evt) evt.stopPropagation();
    this.remove.emit();
  }

  onRemove(evt?: Event): void {
    if (evt) evt.stopPropagation(); 
    this.remove.emit();
  }
}
