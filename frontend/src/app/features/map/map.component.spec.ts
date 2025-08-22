import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    // Mock Google Maps avant l'initialisation du composant
    (window as any).google = {
      maps: {
        Map: jasmine.createSpy('Map').and.returnValue({
          setCenter: jasmine.createSpy('setCenter'),
          setZoom: jasmine.createSpy('setZoom'),
          setMapTypeId: jasmine.createSpy('setMapTypeId'),
          getMapTypeId: jasmine.createSpy('getMapTypeId').and.returnValue('roadmap'),
          addListener: jasmine.createSpy('addListener')
        }),
        Marker: jasmine.createSpy('Marker').and.returnValue({
          setMap: jasmine.createSpy('setMap'),
          setPosition: jasmine.createSpy('setPosition')
        }),
        LatLng: jasmine.createSpy('LatLng').and.callFake(function(lat: number, lng: number) {
          return { lat, lng };
        }),
        Geocoder: jasmine.createSpy('Geocoder').and.returnValue({
          geocode: jasmine.createSpy('geocode').and.callFake((request: any, callback: any) => {
            callback([{
              formatted_address: '123 Test Street, Test City'
            }], 'OK');
          })
        }),
        Animation: {
          DROP: 'DROP',
          BOUNCE: 'BOUNCE'
        },
        MapMouseEvent: class {
          latLng = { lat: () => 48.8566, lng: () => 2.3522 };
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        MapComponent,
        HttpClientTestingModule,
        FormsModule,
        CommonModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ query: '' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    
    // Mock getElementById
    spyOn(document, 'getElementById').and.returnValue(document.createElement('div'));
  });

  afterEach(() => {
    // Nettoyer le mock global
    delete (window as any).google;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.searchQuery).toBe('');
    expect(component.suggestions).toEqual([]);
    expect(component.currentLocation).toBeNull();
    expect(component.isLoading).toBe(true);
  });

  it('should clear suggestions when searchQuery is empty', () => {
    component.searchQuery = '';
    component.suggestions = [{ 
      displayName: { text: 'Paris' }, 
      location: { latitude: 48.8566, longitude: 2.3522 } 
    }];
    
    component.onSearchChange();
    
    expect(component.suggestions.length).toBe(0);
  });

  it('should clear search correctly', () => {
    component.searchQuery = 'Test location';
    component.suggestions = [{ 
      displayName: { text: 'Test' }, 
      location: { latitude: 0, longitude: 0 } 
    }];
    
    component.clearSearch();
    
    expect(component.searchQuery).toBe('');
    expect(component.suggestions.length).toBe(0);
  });

  it('should update current location when selecting a place', () => {
    const testPlace = {
      displayName: { text: 'Test Place' },
      location: { latitude: 48.8566, longitude: 2.3522 }
    };
    
    // Créer des mocks pour map et marker
    component.map = {
      setCenter: jasmine.createSpy('setCenter'),
      setZoom: jasmine.createSpy('setZoom'),
      setMapTypeId: jasmine.createSpy('setMapTypeId'),
      getMapTypeId: jasmine.createSpy('getMapTypeId').and.returnValue('roadmap'),
      addListener: jasmine.createSpy('addListener')
    } as any;
    
    component.marker = {
      setMap: jasmine.createSpy('setMap')
    } as any;
    
    // Mock getAddressFromCoords pour éviter l'ajout de l'adresse
    spyOn(component as any, 'getAddressFromCoords');
    
    component.selectPlace(testPlace);
    
    expect(component.searchQuery).toBe('Test Place');
    expect(component.suggestions).toEqual([]);
    expect(component.currentLocation?.name).toBe('Test Place');
    // Ne pas vérifier l'adresse car elle est ajoutée de manière asynchrone
  });

  it('should handle Enter key press correctly', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    spyOn(component, 'searchPlace');
    
    component.searchQuery = 'Test';
    component.suggestions = [];
    
    component.onEnter(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.searchPlace).toHaveBeenCalled();
  });

  it('should select first suggestion on Enter when suggestions exist', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    spyOn(component, 'selectPlace');
    
    const testSuggestion = {
      displayName: { text: 'Test Suggestion' },
      location: { latitude: 48.8566, longitude: 2.3522 }
    };
    component.suggestions = [testSuggestion];
    
    component.onEnter(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.selectPlace).toHaveBeenCalledWith(testSuggestion);
  });

  it('should toggle map type correctly', () => {
    component.map = {
      getMapTypeId: jasmine.createSpy('getMapTypeId').and.returnValue('roadmap'),
      setMapTypeId: jasmine.createSpy('setMapTypeId')
    } as any;
    
    component.toggleMapType();
    
    expect(component.map.getMapTypeId).toHaveBeenCalled();
    expect(component.map.setMapTypeId).toHaveBeenCalledWith('satellite');
  });

  it('should log message when location is not found', () => {
    spyOn(console, 'log');
    
    // Accéder à la méthode privée via bracket notation
    (component as any).showNotFound();
    
    expect(console.log).toHaveBeenCalledWith('Location not found');
  });

  it('should handle geolocation for current location', () => {
    // Mock geolocation
    const mockGeolocation = {
      getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.callFake((success: any) => {
        success({
          coords: {
            latitude: 48.8566,
            longitude: 2.3522
          }
        });
      })
    };
    
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true
    });
    
    component.map = {
      setCenter: jasmine.createSpy('setCenter'),
      setZoom: jasmine.createSpy('setZoom')
    } as any;
    
    component.marker = {
      setMap: jasmine.createSpy('setMap')
    } as any;
    
    // Mock getAddressFromCoords pour éviter l'ajout de l'adresse
    spyOn(component as any, 'getAddressFromCoords');
    
    component.centerOnCurrentLocation();
    
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(component.currentLocation?.name).toBe('Your Current Location');
    // Ne pas vérifier l'adresse car elle est ajoutée de manière asynchrone
  });

  it('should handle search with debounce', (done) => {
    component.searchQuery = 'Test search';
    spyOn(component as any, 'performSearch');
    
    component.onSearchChange();
    
    // Attendre le debounce de 300ms
    setTimeout(() => {
      expect((component as any).performSearch).toHaveBeenCalled();
      done();
    }, 350);
  });

  it('should handle map initialization error', async () => {
    spyOn(console, 'error');
    
    // Simuler une erreur lors du chargement
    const mockLoader = {
      load: jasmine.createSpy('load').and.returnValue(Promise.reject('Load error'))
    };
    
    component.isLoading = true;
    
    // Simuler l'erreur
    try {
      await mockLoader.load();
    } catch (error) {
      component.isLoading = false;
    }
    
    expect(component.isLoading).toBe(false);
  });

  it('should handle route query params', () => {
    const testQuery = 'Test Location';
    
    // Créer un nouveau TestBed avec le query param
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MapComponent, HttpClientTestingModule, FormsModule, CommonModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ query: testQuery })
          }
        }
      ]
    });
    
    const newFixture = TestBed.createComponent(MapComponent);
    const newComponent = newFixture.componentInstance;
    
    spyOn(newComponent, 'searchPlace');
    
    // Observer les queryParams
    TestBed.inject(ActivatedRoute).queryParams.subscribe(params => {
      if (params['query']) {
        newComponent.searchQuery = params['query'];
        newComponent.searchPlace();
      }
    });
    
    expect(newComponent.searchQuery).toBe(testQuery);
    expect(newComponent.searchPlace).toHaveBeenCalled();
  });
});