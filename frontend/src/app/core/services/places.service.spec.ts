import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlaceService } from './places.service';

describe('PlaceService', () => {
  let service: PlaceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlaceService]
    });
    service = TestBed.inject(PlaceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch places for a city and type', () => {
    const mockResponse = { 
      results: [{ 
        place_id: 'test-id', 
        name: 'Test Place', 
        formatted_address: '123 Test St' 
      }] 
    };

    service.getPlaces('Paris', 'restaurant').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:9091/api/places?ville=Paris&type=restaurant');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});