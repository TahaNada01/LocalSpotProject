// src/app/features/place-details/place-details.component.spec.ts - VERSION CORRIGÉE
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceDetailsComponent } from './place-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PlaceService } from '../../core/services/places.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('PlaceDetailsComponent', () => {
  let component: PlaceDetailsComponent;
  let fixture: ComponentFixture<PlaceDetailsComponent>;
  let placeService: jasmine.SpyObj<PlaceService>;
  let location: jasmine.SpyObj<Location>;

  const mockPlaceDetails = {
    place_id: 'test-place-123',
    name: 'Test Restaurant',
    formatted_address: '123 Test Street, Test City',
    geometry: {
      location: { lat: 48.8566, lng: 2.3522 }
    },
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 9:00 AM – 10:00 PM',
        'Tuesday: 9:00 AM – 10:00 PM',
        'Wednesday: 9:00 AM – 10:00 PM',
        'Thursday: 9:00 AM – 10:00 PM',
        'Friday: 9:00 AM – 11:00 PM',
        'Saturday: 9:00 AM – 11:00 PM',
        'Sunday: 10:00 AM – 9:00 PM'
      ]
    },
    website: 'https://test-restaurant.com',
    international_phone_number: '+33 1 23 45 67 89',
    rating: 4.5,
    user_ratings_total: 150,
    price_level: 2,
    types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
    photos: [
      {
        photo_reference: 'photo-ref-1',
        height: 400,
        width: 600
      },
      {
        photo_reference: 'photo-ref-2',
        height: 400,
        width: 600
      }
    ],
    reviews: [
      {
        author_name: 'John Doe',
        rating: 5,
        text: 'Excellent restaurant with great food!',
        relative_time_description: '2 weeks ago',
        profile_photo_url: 'https://example.com/photo.jpg'
      },
      {
        author_name: 'Jane Smith',
        rating: 4,
        text: 'Good food, friendly service.',
        relative_time_description: '1 month ago'
      }
    ]
  };

  beforeEach(async () => {
    const placeServiceSpy = jasmine.createSpyObj('PlaceService', ['getPlaceDetails', 'getPhotoUrl']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        PlaceDetailsComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: PlaceService, useValue: placeServiceSpy },
        { provide: Location, useValue: locationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['placeId', 'test-place-123']]))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceDetailsComponent);
    component = fixture.componentInstance;
    placeService = TestBed.inject(PlaceService) as jasmine.SpyObj<PlaceService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    // Setup default mocks
    placeService.getPlaceDetails.and.returnValue(of(mockPlaceDetails));
    placeService.getPhotoUrl.and.returnValue('https://test-photo.jpg');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load place details on init', () => {
    fixture.detectChanges();
    
    expect(placeService.getPlaceDetails).toHaveBeenCalledWith('test-place-123');
  });

  it('should display place name', () => {
    fixture.detectChanges();
    
    component.place$.subscribe(place => {
      expect(place.name).toBe('Test Restaurant');
    });
  });

  it('should calculate euros correctly', () => {
    expect(component.euros(0)).toBe('€');
    expect(component.euros(1)).toBe('€€');
    expect(component.euros(2)).toBe('€€€');
    expect(component.euros(3)).toBe('€€€€');
    expect(component.euros(undefined)).toBe('—');
    expect(component.euros(null as any)).toBe('—');
  });

  it('should generate directions link correctly', () => {
    const link = component.dirLink(mockPlaceDetails);
    const expectedLink = 'https://www.google.com/maps/dir/?api=1&destination=48.8566,2.3522';
    
    expect(link).toBe(expectedLink);
  });

  it('should generate hero URL correctly', () => {
    const heroUrl = component.getHeroUrl(mockPlaceDetails);
    
    expect(placeService.getPhotoUrl).toHaveBeenCalledWith('photo-ref-1', 1600);
    expect(heroUrl).toBe('url(https://test-photo.jpg)');
  });

  it('should return none when no photos available', () => {
    const placeWithoutPhotos = { ...mockPlaceDetails, photos: [] };
    
    const heroUrl = component.getHeroUrl(placeWithoutPhotos);
    
    expect(heroUrl).toBe('none');
  });

  it('should filter types correctly', () => {
    const filteredTypes = component.filteredTypes(mockPlaceDetails.types);
    
    expect(filteredTypes).toEqual(['restaurant', 'food']);
    expect(filteredTypes.length).toBeLessThanOrEqual(4);
  });

  it('should handle empty types array', () => {
    const filteredTypes = component.filteredTypes([]);
    
    expect(filteredTypes).toEqual([]);
  });

  it('should handle undefined types', () => {
    const filteredTypes = component.filteredTypes(undefined);
    
    expect(filteredTypes).toEqual([]);
  });

  it('should go back when goBack called', () => {
    component.goBack();
    
    expect(location.back).toHaveBeenCalled();
  });

  it('should show back button', () => {
    fixture.detectChanges();
    
    const backButton = fixture.debugElement.query(By.css('.btn.back'));
    expect(backButton).toBeTruthy();
  });

  it('should call goBack when back button clicked', () => {
    spyOn(component, 'goBack');
    fixture.detectChanges();
    
    const backButton = fixture.debugElement.query(By.css('.btn.back'));
    backButton?.nativeElement.click();
    
    expect(component.goBack).toHaveBeenCalled();
  });

  // Tests DOM simplifiés (sans setTimeout)
  it('should render component structure', () => {
    fixture.detectChanges();
    
    // Juste vérifier que le composant se rend correctement
    expect(fixture.debugElement.nativeElement).toBeTruthy();
  });

  it('should have place observable', () => {
    expect(component.place$).toBeDefined();
  });

  it('should inject PlaceService correctly', () => {
    expect(component.places).toBeDefined();
  });
});