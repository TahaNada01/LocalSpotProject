import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent, HttpClientTestingModule],
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
    
    // Mock Google Maps API
    spyOn(document, 'getElementById').and.returnValue(document.createElement('div'));
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should clear suggestions when searchQuery is empty', () => {
    component.searchQuery = '';
    component.suggestions = [{ displayName: { text: 'Paris' }, location: { latitude: 0, longitude: 0 } }];
    component.onSearchChange();
    expect(component.suggestions.length).toBe(0);
  });
});