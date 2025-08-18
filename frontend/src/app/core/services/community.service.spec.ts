import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommunityService } from './community.service';

describe('CommunityService', () => {
  let service: CommunityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunityService]
    });
    service = TestBed.inject(CommunityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch public places with default parameters', () => {
    const mockResponse = {
      content: [{ id: 1, name: 'Test Place', category: 'Restaurant' }],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 12,
      first: true,
      last: true,
      empty: false
    };

    service.list({}).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => 
      req.url === 'http://localhost:9091/api/places/public' &&
      req.params.get('page') === '0' &&
      req.params.get('size') === '12'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch public places with filters', () => {
    const params = { page: 1, size: 10, city: 'Paris', category: 'Restaurant' };

    service.list(params).subscribe();

    const req = httpMock.expectOne(req => 
      req.url === 'http://localhost:9091/api/places/public' &&
      req.params.get('page') === '1' &&
      req.params.get('size') === '10' &&
      req.params.get('city') === 'Paris' &&
      req.params.get('category') === 'Restaurant'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0 });
  });

  it('should fetch a single public place', () => {
    const mockPlace = { id: 1, name: 'Test Place', category: 'Restaurant' };
    const placeId = 1;

    service.getOne(placeId).subscribe(place => {
      expect(place).toEqual(mockPlace);
    });

    const req = httpMock.expectOne(`http://localhost:9091/api/places/public/${placeId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlace);
  });
});