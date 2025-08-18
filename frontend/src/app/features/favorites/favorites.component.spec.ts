import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FavoritesService } from '../../core/services/favorites.service';
import { of, throwError } from 'rxjs';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;

  const mockFavorites = [
    {
      name: 'Favorite Cafe',
      address: '123 Coffee St',
      placeId: 'cafe123',
      photoReference: 'photo123',
      rating: 4.5,
      openNow: true
    }
  ];

  beforeEach(async () => {
    const favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['getFavorites', 'deleteFavorite']);

    await TestBed.configureTestingModule({
      imports: [
        FavoritesComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService) as jasmine.SpyObj<FavoritesService>;

    // Setup default mock
    favoritesService.getFavorites.and.returnValue(of(mockFavorites));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorites on init', () => {
    component.ngOnInit();
    
    expect(favoritesService.getFavorites).toHaveBeenCalled();
    expect(component.favorites).toEqual(mockFavorites);
    expect(component.transformedFavorites.length).toBe(1);
  });

  it('should transform favorites correctly', () => {
    component.ngOnInit();
    
    const transformed = component.transformedFavorites[0];
    expect(transformed.name).toBe('Favorite Cafe');
    expect(transformed.address).toBe('123 Coffee St');
    expect(transformed.placeId).toBe('cafe123');
    expect(transformed.opening_hours.open_now).toBe(true);
  });

  it('should handle favorites loading error', () => {
    favoritesService.getFavorites.and.returnValue(throwError('Error'));
    spyOn(console, 'error');
    
    component.loadFavorites();
    
    expect(console.error).toHaveBeenCalledWith('Erreur lors du chargement des favoris:', 'Error');
    expect(component.isLoadingFavorites).toBe(false);
  });

  it('should delete favorite successfully', () => {
    favoritesService.deleteFavorite.and.returnValue(of(''));
    spyOn(component, 'loadFavorites');
    
    component.deleteFavorite('cafe123');
    
    expect(favoritesService.deleteFavorite).toHaveBeenCalledWith('cafe123');
    expect(component.loadFavorites).toHaveBeenCalled();
  });

  it('should handle favorite deletion error', () => {
    favoritesService.deleteFavorite.and.returnValue(throwError('Error'));
    spyOn(console, 'error');
    
    component.deleteFavorite('cafe123');
    
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la suppression:', 'Error');
  });
});