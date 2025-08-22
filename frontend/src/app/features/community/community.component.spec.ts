import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityComponent } from './community.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommunityService } from '../../core/services/community.service';
import { PublicPlace } from '../../core/models/community.models';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('CommunityComponent', () => {
  let component: CommunityComponent;
  let fixture: ComponentFixture<CommunityComponent>;
  let communityService: jasmine.SpyObj<CommunityService>;

  const mockPageResponse = {
    content: [
      {
        id: 1,
        name: 'Community Cafe',
        imageUrl: '/media/cafe.jpg',
        createdById: 1,
        openingHoursJson: '{"mon":{"open":"09:00","close":"18:00"}}',
        addressLine: '123 Community St',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        category: 'Cafe',
        shortDescription: 'Great community cafe',
        avgPrice: 12,
        priceRange: '€' as const
      },
      {
        id: 2,
        name: 'Community Park',
        imageUrl: null,
        createdById: 2,
        openingHoursJson: '{"mon":{"allDay":true}}',
        addressLine: '456 Park Ave',
        city: 'Lyon',
        postalCode: '69001',
        country: 'France',
        category: 'Park',
        shortDescription: 'Beautiful park for everyone',
        avgPrice: null,
        priceRange: null
      }
    ],
    totalElements: 2,
    totalPages: 1,
    number: 0,
    size: 12,
    first: true,
    last: true,
    empty: false
  };

  beforeEach(async () => {
    const communityServiceSpy = jasmine.createSpyObj('CommunityService', ['list', 'getOne']);

    await TestBed.configureTestingModule({
      imports: [
        CommunityComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: CommunityService, useValue: communityServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityComponent);
    component = fixture.componentInstance;
    communityService = TestBed.inject(CommunityService) as jasmine.SpyObj<CommunityService>;

    // Setup default mock
    communityService.list.and.returnValue(of(mockPageResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load places on init', () => {
    spyOn(component, 'load');
    
    component.ngOnInit();
    
    expect(component.load).toHaveBeenCalled();
  });

  it('should load places successfully', () => {
    component.load();
    
    expect(communityService.list).toHaveBeenCalledWith({
      page: 0,
      size: 12,
      city: undefined,
      category: undefined
    });
    expect(component.items.length).toBe(2);
    expect(component.loading).toBe(false);
    expect(component.last).toBe(true);
  });

  it('should handle loading error', () => {
    communityService.list.and.returnValue(throwError({ error: { message: 'Test error' } }));
    
    component.load();
    
    expect(component.error).toBe('Test error');
    expect(component.loading).toBe(false);
  });

  it('should reset and load correctly', () => {
    component.items = [mockPageResponse.content[0]];
    component.page = 2;
    component.last = true;
    spyOn(component, 'load');
    
    component.resetAndLoad();
    
    expect(component.items.length).toBe(0);
    expect(component.page).toBe(0);
    expect(component.last).toBe(false);
    expect(component.load).toHaveBeenCalled();
  });

  it('should generate full image URL correctly', () => {
    const url = component.fullImg('/media/test.jpg');
    expect(url).toBe('http://localhost:9091/media/test.jpg');
    
    const httpUrl = component.fullImg('http://example.com/image.jpg');
    expect(httpUrl).toBe('http://example.com/image.jpg');
    
    const emptyUrl = component.fullImg('');
    expect(emptyUrl).toBe('assets/placeholder.png'); // ✅ Correct
  });

  it('should calculate euro symbol correctly', () => {
    // Crée des objets PublicPlace complets pour les tests
    const testPlace1: Partial<PublicPlace> = { 
      id: 1, 
      name: 'Test1', 
      priceRange: '€€' as const, 
      avgPrice: null 
    };
    expect(component.euro(testPlace1 as PublicPlace)).toBe('€€');
    
    const testPlace2: Partial<PublicPlace> = { 
      id: 2, 
      name: 'Test2', 
      priceRange: null, 
      avgPrice: 5 
    };
    expect(component.euro(testPlace2 as PublicPlace)).toBe('€');
    
    const testPlace3: Partial<PublicPlace> = { 
      id: 3, 
      name: 'Test3', 
      priceRange: null, 
      avgPrice: 20 
    };
    expect(component.euro(testPlace3 as PublicPlace)).toBe('€€');
    
    const testPlace4: Partial<PublicPlace> = { 
      id: 4, 
      name: 'Test4', 
      priceRange: null, 
      avgPrice: 50 
    };
    expect(component.euro(testPlace4 as PublicPlace)).toBe('€€€');
    
    const testPlace5: Partial<PublicPlace> = { 
      id: 5, 
      name: 'Test5', 
      priceRange: null, 
      avgPrice: null 
    };
    expect(component.euro(testPlace5 as PublicPlace)).toBeNull();
  });

  it('should calculate opening status correctly for open place', () => {
    const openPlace: Partial<PublicPlace> = {
      id: 1,
      name: 'Open Place',
      openingHoursJson: '{"mon":{"open":"09:00","close":"18:00"}}'
    };
    
    // Mock current time to be Monday 12:00
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2024, 0, 1, 12, 0)); // Monday
    
    const status = component.openStatus(openPlace as PublicPlace);
    expect(status.text).toContain('Open now');
    expect(status.cls).toBe('open');
    
    jasmine.clock().uninstall();
  });

  it('should handle closed status correctly', () => {
    const closedPlace: Partial<PublicPlace> = {
      id: 2,
      name: 'Closed Place',
      openingHoursJson: JSON.stringify({
        mon: { closed: true }
      })
    };
    
    // Mock current day as Monday
    jasmine.clock().install();
    const monday = new Date(2024, 0, 1, 12, 0); // January 1, 2024 is a Monday
    jasmine.clock().mockDate(monday);
    
    const status = component.openStatus(closedPlace as PublicPlace);
    expect(status.text).toBe('Closed now');
    expect(status.cls).toBe('closed');
    
    jasmine.clock().uninstall();
  });

  it('should handle 24/7 status correctly', () => {
    const alwaysOpenPlace: Partial<PublicPlace> = {
      id: 3,
      name: 'Always Open',
      openingHoursJson: JSON.stringify({
        mon: { allDay: true }
      })
    };
    
    // Mock current day as Monday
    jasmine.clock().install();
    const monday = new Date(2024, 0, 1, 12, 0); // January 1, 2024 is a Monday
    jasmine.clock().mockDate(monday);
    
    const status = component.openStatus(alwaysOpenPlace as PublicPlace);
    expect(status.text).toBe('Open 24/7');
    expect(status.cls).toBe('allday');
    
    jasmine.clock().uninstall();
  });

  it('should handle unknown hours correctly', () => {
    const unknownPlace: Partial<PublicPlace> = { 
      id: 4,
      name: 'Unknown Hours',
      openingHoursJson: null 
    };
    
    const status = component.openStatus(unknownPlace as PublicPlace);
    expect(status.text).toBe('Hours unknown');
    expect(status.cls).toBe('unknown');
  });

  it('should track items by id', () => {
    const testPlace = { id: 123 };
    const result = component.trackById(0, testPlace as any);
    expect(result).toBe(123);
  });

  // DOM Tests simplifiés
  it('should render page header', () => {
    fixture.detectChanges();
    
    const header = fixture.debugElement.query(By.css('.header .title'));
    expect(header?.nativeElement.textContent).toContain('Community');
  });

  it('should render filter form', () => {
    fixture.detectChanges();
    
    const cityInput = fixture.debugElement.query(By.css('input[formControlName="city"]'));
    const categoryInput = fixture.debugElement.query(By.css('input[formControlName="category"]'));
    
    expect(cityInput).toBeTruthy();
    expect(categoryInput).toBeTruthy();
  });
});