import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { MyPlacesService } from '../../core/services/my-places.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

// Mock SweetAlert2 avec Jasmine
const mockSwal = {
  fire: jasmine.createSpy('fire').and.returnValue(Promise.resolve({ isConfirmed: true }))
};


(window as any).Swal = mockSwal;

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let myPlacesService: jasmine.SpyObj<MyPlacesService>;

  const mockUser = {
    id: 1,
    nom: 'Test User',
    email: 'test@example.com',
    ville: 'Paris',
    role: 'USER',
    profilPhoto: ''
  };

  const mockFavorites = [
    {
      placeId: '1',
      name: 'Favorite Place',
      address: '123 Test St',
      photoReference: 'photo-ref',
      rating: 4.5,
      openNow: true
    }
  ];

  const mockMyPlaces = [
    {
      id: 1,
      name: 'My Place',
      category: 'Cafe',
      addressLine: '456 My St',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      shortDescription: 'Great place',
      priceRange: '€' as const,
      avgPrice: 15,
      imageUrl: '/media/image.jpg',
      openingHoursJson: '{"mon":{"open":"09:00","close":"18:00"}}'
    }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'updateUser']);
    const favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['getFavorites', 'deleteFavorite']);
    const myPlacesServiceSpy = jasmine.createSpyObj('MyPlacesService', ['listMine', 'delete', 'update']);

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy },
        { provide: MyPlacesService, useValue: myPlacesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    favoritesService = TestBed.inject(FavoritesService) as jasmine.SpyObj<FavoritesService>;
    myPlacesService = TestBed.inject(MyPlacesService) as jasmine.SpyObj<MyPlacesService>;

    // Setup default mocks
    authService.getCurrentUser.and.returnValue(of(mockUser));
    favoritesService.getFavorites.and.returnValue(of(mockFavorites));
    myPlacesService.listMine.and.returnValue(of(mockMyPlaces));

    // Reset Swal mock
    mockSwal.fire.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    component.ngOnInit();
    
    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
    expect(component.username).toBe('@testuser');
  });

  it('should load favorites on init', () => {
    component.ngOnInit();
    
    expect(favoritesService.getFavorites).toHaveBeenCalled();
    expect(component.favorites).toEqual(mockFavorites);
  });

  it('should load my places on init', () => {
    component.ngOnInit();
    
    expect(myPlacesService.listMine).toHaveBeenCalled();
    expect(component.myPlaces).toEqual(mockMyPlaces);
  });

  it('should switch tabs correctly', () => {
    spyOn(component, 'fetchMyPlaces');
    spyOn(component, 'loadFavorites');
    
    component.setActive('places');
    expect(component.activeTab).toBe('places');
    expect(component.fetchMyPlaces).toHaveBeenCalled();
    
    component.setActive('favorites');
    expect(component.activeTab).toBe('favorites');
    expect(component.loadFavorites).toHaveBeenCalled();
  });

  it('should update user profile successfully', () => {
    authService.updateUser.and.returnValue(of({}));
    authService.getCurrentUser.and.returnValue(of(mockUser));
    component.user = mockUser;
    component.newPassword = 'newpass';
    
    component.onSubmit();
    
    expect(authService.updateUser).toHaveBeenCalled();
    expect(component.isEditing).toBe(false);
  });

  it('should handle profile update error', () => {
    authService.updateUser.and.returnValue(throwError('Error'));
    spyOn(console, 'error');
    
    component.onSubmit();
    
    expect(console.error).toHaveBeenCalled();
  });

  it('should delete favorite successfully', () => {
    favoritesService.deleteFavorite.and.returnValue(of(''));
    spyOn(component, 'loadFavorites');
    
    component.deleteFavorite('place123');
    
    expect(favoritesService.deleteFavorite).toHaveBeenCalledWith('place123');
    expect(component.loadFavorites).toHaveBeenCalled();
  });

  it('should handle my places loading error', () => {
    myPlacesService.listMine.and.returnValue(throwError('Error'));
    
    component.fetchMyPlaces();
    
    expect(component.placesError).toBe('Failed to load your places.');
    expect(component.loadingPlaces).toBe(false);
  });

  it('should open edit modal with correct data', () => {
    const place = mockMyPlaces[0];
    
    component.openEdit(place);
    
    expect(component.editing).toBe(place);
    expect(component.editModel.name).toBe(place.name);
    expect(component.editModel.category).toBe(place.category);
    expect(component.editOpen).toBe(true);
  });

  it('should cancel edit correctly', () => {
    component.editOpen = true;
    component.editing = mockMyPlaces[0];
    
    component.cancelEdit();
    
    expect(component.editOpen).toBe(false);
    expect(component.editing).toBeUndefined();
  });

  it('should submit edit successfully', () => {
    myPlacesService.update.and.returnValue(of(mockMyPlaces[0]));
    component.editing = mockMyPlaces[0];
    component.myPlaces = [...mockMyPlaces];
    
    component.submitEdit();
    
    expect(myPlacesService.update).toHaveBeenCalled();
    expect(component.editOpen).toBe(false);
  });

  it('should handle edit submission error', () => {
    myPlacesService.update.and.returnValue(throwError('Error'));
    component.editing = mockMyPlaces[0];
    
    component.submitEdit();
    
    expect(component.savingEdit).toBe(false);
  });

  it('should delete place when confirmed', () => {
    myPlacesService.delete.and.returnValue(of(undefined));
    component.myPlaces = [...mockMyPlaces];
    component.deletingId = undefined;
    
    component.deletingId = mockMyPlaces[0].id;
    myPlacesService.delete(mockMyPlaces[0].id!).subscribe(() => {
      component.myPlaces = component.myPlaces.filter(x => x.id !== mockMyPlaces[0].id);
      component.deletingId = undefined;
    });
    
    expect(myPlacesService.delete).toHaveBeenCalledWith(1);
    expect(component.myPlaces.length).toBe(0);
  });

  it('should generate full image URL correctly', () => {
    const url = component.fullImg('/media/test.jpg');
    expect(url).toBe('http://localhost:9091/media/test.jpg');
    
    const httpUrl = component.fullImg('http://example.com/image.jpg');
    expect(httpUrl).toBe('http://example.com/image.jpg');
    
    const emptyUrl = component.fullImg('');
    expect(emptyUrl).toBe('assets/placeholder.png');
  });

  it('should calculate price tag correctly', () => {
    const place1 = { ...mockMyPlaces[0], priceRange: '€€' as const };
    expect(component.priceTag(place1)).toBe('€€');
    
    const place2 = { ...mockMyPlaces[0], priceRange: null, avgPrice: 5 };
    expect(component.priceTag(place2)).toBe('€');
    
    const place3 = { ...mockMyPlaces[0], priceRange: null, avgPrice: 20 };
    expect(component.priceTag(place3)).toBe('€€');
    
    const place4 = { ...mockMyPlaces[0], priceRange: null, avgPrice: 50 };
    expect(component.priceTag(place4)).toBe('€€€');
  });

  it('should handle hours editor changes', () => {
    // Initialise les heures
    component.hours.mon = { closed: false, allDay: false };
    
    // Test closed change
    component.hours.mon.closed = true;
    component.onClosedChange('mon');
    expect(component.hours.mon.allDay).toBe(false);
    
    // Test allDay change  
    component.hours.mon = { closed: false, allDay: false };
    component.hours.mon.allDay = true;
    component.onAllDayChange('mon');
    expect(component.hours.mon.closed).toBe(false);
  });

  it('should copy Monday hours to all days', () => {
    component.hours.mon = { open: '10:00', close: '20:00' };
    
    component.copyMonToAll();
    
    expect(component.hours.tue.open).toBe('10:00');
    expect(component.hours.tue.close).toBe('20:00');
  });

  // DOM Tests
  it('should render profile header', () => {
    component.user = mockUser;
    fixture.detectChanges();
    
    const userName = fixture.debugElement.query(By.css('h2'));
    expect(userName?.nativeElement.textContent).toContain('Test User');
  });

  it('should show edit button', () => {
    fixture.detectChanges();
    
    const editButton = fixture.debugElement.query(By.css('.edit-btn'));
    expect(editButton).toBeTruthy();
  });

  it('should render tabs', () => {
    fixture.detectChanges();
    
    const tabs = fixture.debugElement.queryAll(By.css('.tab'));
    expect(tabs.length).toBe(3);
  });
});