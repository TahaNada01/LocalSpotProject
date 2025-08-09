import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss'],
})
export class PlaceCardComponent {
  @Input() place!: {
    name: string;
    address: string;
    photoReference?: string;
    opening_hours?: { open_now?: boolean };
    rating?: number;
  };

  @Input() isFavorite: boolean = false;
  @Input() showRemoveButton: boolean = false;

  @Output() remove = new EventEmitter<void>();

  getPhotoUrl(): string {
    return this.place.photoReference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${this.place.photoReference}&key=${environment.googleApiKey}`
      : '';
  }

  onToggleFavorite(): void {
    this.remove.emit();
  }

  onRemove(): void {
    this.remove.emit();
  }
}
