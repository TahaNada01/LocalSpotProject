import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { User } from '../../core/models/user.model';
import { Favorite } from '../../core/models/favorite.model';

import { environment } from '../../../environments/environment';
import { PlaceCardComponent } from '../place-card/place-card.component';

import { MyPlacesService } from '../../core/services/my-places.service';
import { MyPlace } from '../../core/models/my-place.model';

import Swal, { SweetAlertResult } from 'sweetalert2';

type DayKey = 'sun'|'mon'|'tue'|'wed'|'thu'|'fri'|'sat';

type DayHours = { closed?: boolean; allDay?: boolean; open?: string; close?: string };
type HoursMap  = Record<DayKey, DayHours>;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, PlaceCardComponent, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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
  newPassword = '';
  activeTab: 'places' | 'reviews' | 'favorites' = 'places';
  isEditing = false; 
  deletingId?: number; 

  // ----- Favoris -----
  favorites: Favorite[] = [];
  transformedFavorites: any[] = [];
  isLoadingFavorites = false;

  // ----- Mes places -----
  myPlaces: MyPlace[] = [];
  loadingPlaces = false;
  placesError?: string;

  // ----- Edition d'une place -----
  editOpen = false; 
  savingEdit = false;  
  editing?: MyPlace;
  editModel: {
    name: string;
    category: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
    shortDescription: string;
    priceRange: '' | '€' | '€€' | '€€€';
    avgPrice: number | null;
    openingHoursJson: string;
  } = {
    name: '',
    category: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: '',
    shortDescription: '',
    priceRange: '',
    avgPrice: null,
    openingHoursJson: ''
  };
  newPhotoFile?: File;

  // === AJOUT : état pour l’éditeur d’horaires ===
  showRawHours = false;
  dayKeys: DayKey[] = ['mon','tue','wed','thu','fri','sat','sun'];
  dayLabel: Record<DayKey,string> = {
    mon:'Mon', tue:'Tue', wed:'Wed', thu:'Thu', fri:'Fri', sat:'Sat', sun:'Sun'
  };
  hours: HoursMap = { mon:{}, tue:{}, wed:{}, thu:{}, fri:{}, sat:{}, sun:{} };

  private readonly BACKEND = 'http://localhost:9091';

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private myPlacesService: MyPlacesService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data: User) => {
      this.user = data;
      this.username =
        '@' + (this.user.nom ? this.user.nom.toLowerCase().replace(/\s/g, '') : 'unknown');
      if (!this.user.ville) this.user.ville = 'Unknown';

      this.fetchMyPlaces();
      this.loadFavorites();
    });

    
  }

  // =========================
  // Mes places
  // =========================
  fetchMyPlaces(): void {
    this.loadingPlaces = true;
    this.placesError = undefined;

    this.myPlacesService.listMine().subscribe({
      next: (items) => {
        this.myPlaces = items;
        this.loadingPlaces = false;
      },
      error: () => {
        this.placesError = 'Failed to load your places.';
        this.loadingPlaces = false;
      }
    });
  }

  fullImg(url?: string): string {
    if (!url) return 'assets/placeholder.png';
    return url.startsWith('http') ? url : `${this.BACKEND}${url}`;
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/placeholder.png';
  }

  priceTag(p: MyPlace): '€' | '€€' | '€€€' | null {
    if (p.priceRange) return p.priceRange;
    const v = p.avgPrice;
    if (v == null) return null;
    if (v < 10) return '€';
    if (v < 25) return '€€';
    return '€€€';
  }

  /** Même logique que dans Community pour afficher Open/Closed depuis openingHoursJson */
  openStatus(p: MyPlace): { text: string; cls: 'open'|'closed'|'allday'|'unknown' } {
    try {
      if (!p.openingHoursJson) return { text: 'Hours unknown', cls: 'unknown' };

      const data = JSON.parse(p.openingHoursJson) as Record<DayKey, {
        closed?: boolean; allDay?: boolean; open?: string; close?: string;
      }>;

      const now = new Date();
      const dayKey = (['sun','mon','tue','wed','thu','fri','sat'] as DayKey[])[now.getDay()];
      const d = data[dayKey];
      if (!d) return { text: 'Hours unknown', cls: 'unknown' };
      if (d.closed) return { text: 'Closed now', cls: 'closed' };
      if (d.allDay) return { text: 'Open 24/7', cls: 'allday' };

      const toMin = (hhmm?: string) => {
        if (!hhmm) return NaN;
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
      };

      const cur   = now.getHours() * 60 + now.getMinutes();
      const start = toMin(d.open);
      const end   = toMin(d.close);
      if (isNaN(start) || isNaN(end)) return { text: 'Hours unknown', cls: 'unknown' };

      // gère les horaires qui passent minuit (ex: 18:00–02:00)
      const isOpen =
        (start <= end && cur >= start && cur <= end) ||
        (start > end && (cur >= start || cur <= end));

      if (isOpen) return { text: end === 1439 ? 'Open now' : `Open now · until ${d.close}`, cls: 'open' };
      return { text: `Closed · opens ${d.open}`, cls: 'closed' };
    } catch {
      return { text: 'Hours unknown', cls: 'unknown' };
    }
  }

  // Tabs
  setActive(tab: 'places' | 'reviews' | 'favorites') {
    this.activeTab = tab;
    if (tab === 'places') this.fetchMyPlaces();
    if (tab === 'favorites') this.loadFavorites();
  }

  // =========================
  // Favoris
  // =========================
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
          opening_hours: { open_now: fav.openNow },
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
        // feedback
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
      }
    });
  }

  // =========================
  // Profil (modal "Edit profile")
  // =========================
  onSubmit(): void {
  const updatedUser = { ...this.user };
  if (this.newPassword.trim()) updatedUser.motDePasse = this.newPassword;
  else delete (updatedUser as any).motDePasse;

  this.authService.updateUser(updatedUser).subscribe({
    next: () => {
      this.authService.getCurrentUser().subscribe((refreshedUser: User) => {
        this.user = refreshedUser;
        this.newPassword = '';
        this.isEditing = false;

        
        Swal.fire({
          icon: 'success',
          title: 'Profile saved',
          timer: 1400,
          showConfirmButton: false
        });
      });
    },
    error: (err: any) => {
      console.error('Update error:', err);
      // (optionnel) popup d’erreur
      Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: 'Please try again.'
      });
    }
  });
}


  // =========================
  // Suppression d'une place
  // =========================
  confirmDelete(p: MyPlace) {
    Swal.fire({
      title: 'Delete this place?',
      text: `“${p.name}” will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626'
    }).then((res: SweetAlertResult) => {
      if (res.isConfirmed && p.id != null) {
        this.deletingId = p.id;
        this.myPlacesService.delete(p.id).subscribe({
          next: () => {
            this.myPlaces = this.myPlaces.filter(x => x.id !== p.id);
            this.deletingId = undefined;
            Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
          },
          error: () => {
            this.deletingId = undefined;
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not delete this place.' });
          }
        });
      }
    });
  }

  // ======================================================
  //        >>> EDITION D'UNE PLACE (form + horaires) <<<
  // ======================================================

  /** Construit l’objet HoursMap depuis un JSON (ou retourne un squelette) */
  private parseHours(json?: string | null): HoursMap {
    const base: HoursMap = { mon:{}, tue:{}, wed:{}, thu:{}, fri:{}, sat:{}, sun:{} };
    if (!json) return base;
    try {
      const obj = JSON.parse(json) as Partial<HoursMap>;
      for (const k of this.dayKeys) base[k] = { ...(obj as any)?.[k] };
      return base;
    } catch { return base; }
  }
  /** Sérialise l’éditeur visuel en JSON */
  private hoursToJson(h: HoursMap): string {
    return JSON.stringify(h);
  }
  onClosedChange(d: DayKey) { if (this.hours[d].closed) this.hours[d].allDay = false; }
  onAllDayChange(d: DayKey)  { if (this.hours[d].allDay)  this.hours[d].closed = false; }
  copyMonToAll() {
    const src = { ...this.hours.mon };
    for (const d of this.dayKeys) if (d !== 'mon') this.hours[d] = { ...src };
  }

  /** Ouvre la modale et pré-remplit le formulaire avec la place */
  openEdit(p: MyPlace) {
    this.editing = p;
    this.editModel = {
      name: p.name ?? '',
      category: p.category ?? '',
      addressLine: p.addressLine ?? '',
      city: p.city ?? '',
      postalCode: p.postalCode ?? '',
      country: p.country ?? '',
      shortDescription: p.shortDescription ?? '',
      priceRange: (p.priceRange as any) || '',
      avgPrice: p.avgPrice ?? null,
      openingHoursJson: p.openingHoursJson ?? ''
    };
    // === init éditeur horaires ===
    this.hours = this.parseHours(this.editModel.openingHoursJson);
    this.showRawHours = false;

    this.newPhotoFile = undefined;
    this.editOpen = true;
  }

  /** Récupère le fichier choisi (photo optionnelle) */
  onEditFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.newPhotoFile = f;
  }

  /** Ferme la modale d'édition */
  cancelEdit() {
    this.editOpen = false;
    this.editing = undefined;
    this.newPhotoFile = undefined;
  }

  /** Soumet l'édition vers l'API (multipart si photo) */
  submitEdit() {
    if (!this.editing || this.editing.id == null) return;
    this.savingEdit = true;

    // Si l’utilisateur n’édite pas le JSON brut, on sérialise l’éditeur visuel
    if (!this.showRawHours) {
      this.editModel.openingHoursJson = this.hoursToJson(this.hours);
    }

    this.myPlacesService.update(this.editing.id, this.editModel, this.newPhotoFile).subscribe({
      next: (updated) => {
        // remplace l’élément dans la liste locale
        const i = this.myPlaces.findIndex(x => x.id === updated.id);
        if (i > -1) this.myPlaces[i] = { ...this.myPlaces[i], ...updated };

        this.savingEdit = false;
        this.editOpen = false;
        Swal.fire({ icon: 'success', title: 'Saved', timer: 1000, showConfirmButton: false });
      },
      error: () => {
        this.savingEdit = false;
        Swal.fire({ icon: 'error', title: 'Update failed', text: 'Could not update this place.' });
      }
    });
  }
}
