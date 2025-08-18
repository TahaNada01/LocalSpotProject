import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritesService]
    });
    service = TestBed.inject(FavoritesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user favorites', () => {
    const mockFavorites = [
      { name: 'Test Place', address: '123 Test St', placeId: 'test-id', rating: 4.5, openNow: true }
    ];

    service.getFavorites().subscribe(favorites => {
      expect(favorites).toEqual(mockFavorites);
    });

    const req = httpMock.expectOne('http://localhost:9091/favorites');
    expect(req.request.method).toBe('GET');
    req.flush(mockFavorites);
  });

  it('should add a favorite', () => {
    const newFavorite = { 
      name: 'New Place', 
      address: '456 New St', 
      placeId: 'new-id',
      photoReference: 'photo-ref',
      rating: 4.0,
      openNow: false
    };

    service.addFavorite(newFavorite).subscribe(favorite => {
      expect(favorite).toEqual(newFavorite);
    });

    const req = httpMock.expectOne('http://localhost:9091/favorites');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newFavorite);
    req.flush(newFavorite);
  });

  it('should delete a favorite', () => {
    const placeId = 'test-place-id';

    service.deleteFavorite(placeId).subscribe(response => {
      expect(response).toBe('');
    });

    const req = httpMock.expectOne(`http://localhost:9091/favorites/${placeId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('');
  });
});