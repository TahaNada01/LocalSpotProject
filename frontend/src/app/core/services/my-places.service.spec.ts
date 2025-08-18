import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyPlacesService } from './my-places.service';

describe('MyPlacesService', () => {
  let service: MyPlacesService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:9091/api/places/user';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyPlacesService]
    });
    service = TestBed.inject(MyPlacesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user places', () => {
    const mockPlaces = [
      { id: 1, name: 'My Place', category: 'Restaurant', city: 'Paris' }
    ];

    service.listMine().subscribe(places => {
      expect(places).toEqual(mockPlaces);
    });

    const req = httpMock.expectOne(`${baseUrl}/mine`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlaces);
  });

  it('should delete a place', () => {
    const placeId = 1;

    service.delete(placeId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/${placeId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update a place', () => {
    const placeId = 1;
    const updateData = { name: 'Updated Place', category: 'Cafe' };
    const mockResponse = { id: 1, name: 'Updated Place', category: 'Cafe' };

    service.update(placeId, updateData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${placeId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBeInstanceOf(FormData);
    req.flush(mockResponse);
  });
});