import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserPlacesService } from '../../core/services/user-places.service';
import { CreateUserPlace } from '../../core/models/user-place.models';
import { Router } from '@angular/router';

type DayKey = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun';

@Component({
  selector: 'app-add-place',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent {
  categories = ['Bars','Cafe','Library','Park','Restaurant','Museum','Gym'];
  file?: File;
  previewUrl?: string;
  saving = false;
  success?: { id: number; name: string };

  days = [
    { key: 'mon' as DayKey, label: 'Mon' },
    { key: 'tue' as DayKey, label: 'Tue' },
    { key: 'wed' as DayKey, label: 'Wed' },
    { key: 'thu' as DayKey, label: 'Thu' },
    { key: 'fri' as DayKey, label: 'Fri' },
    { key: 'sat' as DayKey, label: 'Sat' },
    { key: 'sun' as DayKey, label: 'Sun' }
  ];

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private places: UserPlacesService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: [null as string | null, Validators.required],
      addressLine: ['', Validators.required],

      city: [
        '',
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.pattern(/^[A-Za-zÀ-ÿ' -]+$/)
        ]
      ],

      postalCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^\d{3,10}$/)
        ]
      ],

      country: ['France', Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(200)]],
      priceRange: ['' as '' | '€' | '€€' | '€€€'],
      avgPrice: [null as number | null],
      openingHours: this.fb.array(this.days.map(() => this.buildDayGroup()))
    });
  }

  private buildDayGroup(): FormGroup {
    return this.fb.group({
      closed: [false],
      allDay: [false],
      open: ['09:00'],
      close: ['18:00']
    });
  }

  get openingHoursFA(): FormArray<FormGroup> {
    return this.form.get('openingHours') as FormArray<FormGroup>;
  }

  // helpers UI
  isDisabled(i: number): boolean {
    const v = (this.openingHoursFA.at(i) as FormGroup).value as any;
    return !!v.closed || !!v.allDay;
  }

  onClosedChanged(i: number) {
    const g = this.openingHoursFA.at(i) as FormGroup;
    if (g.get('closed')!.value) {
      g.patchValue({ allDay: false });
    }
  }

  onAllDayChanged(i: number) {
    const g = this.openingHoursFA.at(i) as FormGroup;
    if (g.get('allDay')!.value) {
      g.patchValue({ closed: false, open: '00:00', close: '23:59' });
    }
  }

  copyToAll(i: number) {
    const src = (this.openingHoursFA.at(i) as FormGroup).value;
    this.openingHoursFA.controls.forEach((ctrl, idx) => {
      if (idx === i) return;
      (ctrl as FormGroup).patchValue(src);
    });
  }

  copyToNext(i: number) {
    if (i >= this.openingHoursFA.length - 1) return;
    const src = (this.openingHoursFA.at(i) as FormGroup).value;
    (this.openingHoursFA.at(i + 1) as FormGroup).patchValue(src);
  }

  preset247() {
    this.openingHoursFA.controls.forEach(c =>
      (c as FormGroup).patchValue({ closed: false, allDay: true, open: '00:00', close: '23:59' })
    );
  }

  presetWeek(open = '09:00', close = '18:00') {
    this.days.forEach((d, i) => {
      const isWeekend = d.key === 'sat' || d.key === 'sun';
      (this.openingHoursFA.at(i) as FormGroup).patchValue(
        isWeekend
          ? { closed: true, allDay: false, open, close }
          : { closed: false, allDay: false, open, close }
      );
    });
  }

  clearHours() {
    this.openingHoursFA.controls.forEach(c =>
      (c as FormGroup).patchValue({ closed: false, allDay: false, open: '09:00', close: '18:00' })
    );
  }

  // forbid digits in City; allow letters, spaces, apostrophes & hyphens
  lettersOnly(e: KeyboardEvent) {
    const k = e.key;
    if (k.length === 1 && !/^[A-Za-zÀ-ÿ' -]$/.test(k)) {
      e.preventDefault();
    }
  }

  // allow only digits for ZIP; let navigation keys through
  numbersOnly(e: KeyboardEvent) {
    const k = e.key;
    const controlKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (controlKeys.includes(k)) { return; }
    if (!/^\d$/.test(k)) { e.preventDefault(); }
  }

  private buildOpeningHoursJson(): string {
    const arr = this.openingHoursFA.value as any[];
    const obj: Record<DayKey, any> = {} as any;
    this.days.forEach((d, i) => {
      const v = arr[i];
      obj[d.key] = {
        closed: !!v.closed,
        allDay: !!v.allDay,
        open: v.open ?? '09:00',
        close: v.close ?? '18:00'
      };
    });
    return JSON.stringify(obj);
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) { this.file = undefined; this.previewUrl = undefined; return; }

    // optional: client-side guard
    const allowed = ['image/png','image/jpeg','image/webp'];
    if (!allowed.includes(f.type)) {
      alert('Please choose a PNG, JPEG or WEBP image.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('Image is too large (max 5 MB).');
      return;
    }

    this.file = f;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(f);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;

    const payload = this.form.value as unknown as CreateUserPlace;
    payload.openingHoursJson = this.buildOpeningHoursJson();

    this.places.create(payload, this.file).subscribe({
      next: (res) => {
        this.saving = false;

        // show success banner
        this.success = { id: res.id, name: payload.name || 'Place' };

        // reset for a new entry
        this.form.reset({ country: 'France', priceRange: '' });
        this.file = undefined;
        this.previewUrl = undefined;

        // optional: scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.saving = false;
        alert('Error: ' + (err?.error?.message ?? 'unknown'));
      }
    });
  }

  goToCommunity() {
    this.router.navigate(['/community']);
  }
}
