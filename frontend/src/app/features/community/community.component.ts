import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CommunityService } from '../../core/services/community.service';
import { PublicPlace, PageResp } from '../../core/models/community.models';

type DayKey = 'sun'|'mon'|'tue'|'wed'|'thu'|'fri'|'sat';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent {
  private api = inject(CommunityService);

  // si tu préfères, mets ça dans environment plus tard
  readonly BACKEND = 'http://localhost:9091';

  filters = new FormGroup({
    city: new FormControl<string>('', { nonNullable: true }),
    category: new FormControl<string>('', { nonNullable: true }),
  });

  items: PublicPlace[] = [];
  loading = false;
  error?: string;
  page = 0;
  size = 12;
  last = false;

  ngOnInit(): void {
    this.load();
    this.filters.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.resetAndLoad());
  }

  resetAndLoad(): void {
    this.items = [];
    this.page = 0;
    this.last = false;
    this.load();
  }

  load(): void {
    if (this.loading || this.last) return;
    this.loading = true;

    const { city, category } = this.filters.value;
    this.api.list({
      page: this.page,
      size: this.size,
      city: city ? city.trim() || undefined : undefined,
      category: category ? category.trim() || undefined : undefined
    }).subscribe({
      next: (res: PageResp<PublicPlace>) => {
        this.items.push(...res.content);
        this.last = res.last;
        this.page += 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load places';
        this.loading = false;
      }
    });
  }

  // ---------- media ----------
  fullImg(url?: string | null): string {
    if (!url) return 'assets/placeholder.png';
    return url.startsWith('http') ? url : `${this.BACKEND}${url}`;
  }

  onImgError(ev: Event): void {
    (ev.target as HTMLImageElement).src = 'assets/placeholder.png';
  }

  // ---------- price (€, €€, €€€) ----------
  euro(p: PublicPlace): '€' | '€€' | '€€€' | null {
    if (p.priceRange) return p.priceRange;
    const v = p.avgPrice;
    if (v == null) return null;
    if (v < 10) return '€';
    if (v < 25) return '€€';
    return '€€€';
  }

  // ---------- open/closed status depuis openingHoursJson ----------
  openStatus(p: PublicPlace): { text: string; cls: 'open'|'closed'|'allday'|'unknown' } {
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

      const cur = now.getHours() * 60 + now.getMinutes();
      const start = toMin(d.open);
      const end   = toMin(d.close);
      if (isNaN(start) || isNaN(end)) return { text: 'Hours unknown', cls: 'unknown' };

      // gère les horaires qui passent minuit (ex: 18:00–02:00)
      const isOpen =
        (start <= end && cur >= start && cur <= end) ||
        (start > end  && (cur >= start || cur <= end));

      if (isOpen) {
        return { text: end === 1439 ? 'Open now' : `Open now · until ${d.close}`, cls: 'open' };
      }
      return { text: `Closed · opens ${d.open}`, cls: 'closed' };
    } catch {
      return { text: 'Hours unknown', cls: 'unknown' };
    }
  }

  trackById = (_: number, p: PublicPlace) => p.id;
}
