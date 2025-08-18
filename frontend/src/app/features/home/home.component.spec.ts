import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { PlaceService } from '../../core/services/places.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { CategoriesService } from '../../core/services/categories.service';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let placeService: jasmine.SpyObj<PlaceService>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;

  const mockPlaces = {
    results: [
      {
        place_id: '1',
        name: 'Test Place',
        formatted_address: '123 Test St',
        rating: 4.5,
        photos: [{ photo_reference: 'test-photo' }],
        opening_hours: { open_now: true }
      }
    ]
  };

  const mockFavorites = [
    {
      placeId: '1',
      name: 'Favorite Place',
      address: '456 Fav St',
      photoReference: 'fav-photo',
      rating: 5.0,
      openNow: true
    }
  ];

  beforeEach(async () => {
    const placeServiceSpy = jasmine.createSpyObj('PlaceService', ['getPlaces', 'getNextPage', 'getPhotoUrl']);
    const favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['getFavorites', 'addFavorite', 'deleteFavorite']);
    const categoriesServiceSpy = jasmine.createSpyObj('CategoriesService', ['getCategories']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: PlaceService, useValue: placeServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy },
        { provide: CategoriesService, useValue: categoriesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    placeService = TestBed.inject(PlaceService) as jasmine.SpyObj<PlaceService>;
    favoritesService = TestBed.inject(FavoritesService) as jasmine.SpyObj<FavoritesService>;
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;

    // Setup default mocks
    placeService.getPlaces.and.returnValue(of(mockPlaces));
    favoritesService.getFavorites.and.returnValue(of(mockFavorites));
    categoriesService.getCategories.and.returnValue([
      { label: 'Bars', type: 'bar' },
      { label: 'Cafe', type: 'cafe' }
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load places on init', () => {
    spyOn(component, 'chargerLieux');
    component.ngOnInit();
    expect(component.chargerLieux).toHaveBeenCalled();
  });

  it('should load favorites on init', () => {
    spyOn(component, 'loadFavorites');
    component.ngOnInit();
    expect(component.loadFavorites).toHaveBeenCalled();
  });

  
  it('should handle places loading success', () => {
    component.chargerLieux();
    expect(placeService.getPlaces).toHaveBeenCalledWith('Paris', 'bar');
    expect(component.places.length).toBe(1);
    expect(component.places[0].name).toBe('Test Place');
    expect(component.isLoading).toBe(false);
  });

  it('should handle places loading error', () => {
    placeService.getPlaces.and.returnValue(throwError('Error'));
    spyOn(console, 'error');
    
    component.chargerLieux();
    
    expect(console.error).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('should filter places on search', () => {
    component.allPlaces = mockPlaces.results;
    component.searchTerm = 'Test';
    
    component.onSearch();
    
    expect(component.places.length).toBe(1);
    expect(component.places[0].name).toBe('Test Place');
  });

  it('should reset places when search is empty', () => {
    component.allPlaces = mockPlaces.results;
    component.places = [];
    component.searchTerm = '';
    
    component.onSearch();
    
    expect(component.places).toEqual(component.allPlaces);
  });

  it('should add favorite successfully', () => {
    const mockPlace = {
      place_id: '2',
      name: 'New Favorite',
      formatted_address: '789 New St',
      rating: 4.0,
      favorite: false
    };
    
    // FIX: Spécifier le type de retour correct
    favoritesService.addFavorite.and.returnValue(of({
      placeId: '2',
      name: 'New Favorite', 
      address: '789 New St',
      photoReference: '',
      rating: 4.0,
      openNow: false
    }));
    spyOn(component, 'loadFavorites');
    
    component.toggleFavorite(mockPlace);
    
    expect(favoritesService.addFavorite).toHaveBeenCalled();
    expect(component.loadFavorites).toHaveBeenCalled();
  });

  it('should remove favorite successfully', () => {
    const mockPlace = {
      place_id: '1',
      name: 'Existing Favorite',
      favorite: true
    };
    
    favoritesService.deleteFavorite.and.returnValue(of(''));
    spyOn(component, 'loadFavorites');
    
    component.toggleFavorite(mockPlace);
    
    expect(favoritesService.deleteFavorite).toHaveBeenCalledWith('1');
    expect(component.loadFavorites).toHaveBeenCalled();
  });

  it('should apply filters correctly', () => {
    spyOn(component, 'chargerLieux');
    const filters = { city: 'Lyon', type: 'cafe' };
    
    component.onApplyFilters(filters);
    
    expect(component.ville).toBe('Lyon');
    expect(component.type).toBe('cafe');
    expect(component.drawerOpen).toBe(false);
    expect(component.chargerLieux).toHaveBeenCalled();
  });

  it('should reset search correctly', () => {
    component.allPlaces = mockPlaces.results;
    component.searchTerm = 'test';
    component.places = [];
    
    component.resetSearch();
    
    expect(component.searchTerm).toBe('');
    expect(component.places).toEqual(component.allPlaces);
  });

  it('should generate photo URL correctly', () => {
    placeService.getPhotoUrl.and.returnValue('http://test-photo.jpg');
    
    const url = component.getPhotoUrl('test-ref');
    
    expect(placeService.getPhotoUrl).toHaveBeenCalledWith('test-ref', 400);
    expect(url).toBe('http://test-photo.jpg');
  });

  it('should navigate to details on openDetails', () => {
    spyOn(component['router'], 'navigate');
    
    component.openDetails('place123');
    
    expect(component['router'].navigate).toHaveBeenCalledWith(['/places', 'place123']);
  });

  // Test DOM rendering simplifié
  it('should render search input', () => {
    fixture.detectChanges();
    const searchInput = fixture.debugElement.query(By.css('.search-input'));
    expect(searchInput).toBeTruthy();
  });
});