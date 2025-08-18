import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceCardComponent } from './place-card.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('PlaceCardComponent', () => {
  let component: PlaceCardComponent;
  let fixture: ComponentFixture<PlaceCardComponent>;
  let router: Router;

  const mockPlace = {
    name: 'Test Place',
    address: '123 Test Street',
    photoReference: 'test-photo-ref',
    rating: 4.5,
    opening_hours: { open_now: true },
    place_id: 'test-place-123'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PlaceCardComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Setup default inputs
    component.place = mockPlace;
    component.isFavorite = false;
    component.showRemoveButton = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display place information correctly', () => {
    fixture.detectChanges();
    
    const nameElement = fixture.debugElement.query(By.css('.place-title'));
    const addressElement = fixture.debugElement.query(By.css('.place-address'));
    
    expect(nameElement.nativeElement.textContent).toContain('Test Place');
    expect(addressElement.nativeElement.textContent).toContain('123 Test Street');
  });

  it('should show rating correctly', () => {
    fixture.detectChanges();
    
    const ratingElement = fixture.debugElement.query(By.css('.rating'));
    expect(ratingElement.nativeElement.textContent).toContain('4.5');
  });

  it('should show open status when place is open', () => {
    fixture.detectChanges();
    
    const statusElement = fixture.debugElement.query(By.css('.open'));
    expect(statusElement.nativeElement.textContent).toContain('Open now');
  });

  it('should show closed status when place is closed', () => {
    component.place = {
      ...mockPlace,
      opening_hours: { open_now: false }
    };
    fixture.detectChanges();
    
    const statusElement = fixture.debugElement.query(By.css('.closed'));
    expect(statusElement.nativeElement.textContent).toContain('Closed');
  });

  it('should generate correct photo URL', () => {
    const url = component.getPhotoUrl();
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=test-photo-ref&key=AIzaSyDOZvFWgN8F0utDLHsLKOMDpN9yk4xoJLY`;
    
    expect(url).toBe(expectedUrl);
  });

  it('should return empty string when no photo reference', () => {
    component.place = { ...mockPlace, photoReference: undefined };
    
    const url = component.getPhotoUrl();
    
    expect(url).toBe('');
  });

  it('should get place ID correctly', () => {
    expect(component.id).toBe('test-place-123');
  });

  it('should get place ID from placeId property', () => {
    component.place = {
      ...mockPlace,
      place_id: undefined,
      placeId: 'alternative-id'
    } as any;
    
    expect(component.id).toBe('alternative-id');
  });

  it('should return null when no ID available', () => {
    component.place = {
      ...mockPlace,
      place_id: undefined
    };
    delete (component.place as any).placeId;
    
    expect(component.id).toBeNull();
  });

  it('should generate correct router link', () => {
    expect(component.link).toEqual(['/places', 'test-place-123']);
  });

  it('should return null link when no ID', () => {
    component.place = {
      ...mockPlace,
      place_id: undefined
    };
    
    expect(component.link).toBeNull();
  });

  it('should navigate to details when clicked', () => {
    spyOn(router, 'navigate');
    
    component.goToDetails();
    
    expect(router.navigate).toHaveBeenCalledWith(['/places', 'test-place-123']);
  });

  it('should not navigate when no link available', () => {
    spyOn(router, 'navigate');
    component.place = { ...mockPlace, place_id: undefined };
    
    component.goToDetails();
    
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should emit remove event when toggle favorite called', () => {
    spyOn(component.remove, 'emit');
    
    component.onToggleFavorite();
    
    expect(component.remove.emit).toHaveBeenCalled();
  });

  it('should emit remove event when remove called', () => {
    spyOn(component.remove, 'emit');
    
    component.onRemove();
    
    expect(component.remove.emit).toHaveBeenCalled();
  });

  it('should stop propagation when toggle favorite clicked', () => {
    const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
    
    component.onToggleFavorite(mockEvent);
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should stop propagation when remove clicked', () => {
    const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
    
    component.onRemove(mockEvent);
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  // DOM Tests
  it('should show favorite button when not in remove mode', () => {
    component.showRemoveButton = false;
    fixture.detectChanges();
    
    const favoriteBtn = fixture.debugElement.query(By.css('.favorite-btn'));
    const deleteBtn = fixture.debugElement.query(By.css('.delete-btn'));
    
    expect(favoriteBtn).toBeTruthy();
    expect(deleteBtn).toBeFalsy();
  });

  it('should show remove button when in remove mode', () => {
    component.showRemoveButton = true;
    fixture.detectChanges();
    
    const favoriteBtn = fixture.debugElement.query(By.css('.favorite-btn'));
    const deleteBtn = fixture.debugElement.query(By.css('.delete-btn'));
    
    expect(favoriteBtn).toBeFalsy();
    expect(deleteBtn).toBeTruthy();
  });

  it('should show filled heart when is favorite', () => {
    component.isFavorite = true;
    component.showRemoveButton = false;
    fixture.detectChanges();
    
    const filledHeart = fixture.debugElement.query(By.css('.icon.filled'));
    expect(filledHeart).toBeTruthy();
  });

  it('should show empty heart when not favorite', () => {
    component.isFavorite = false;
    component.showRemoveButton = false;
    fixture.detectChanges();
    
    const emptyHeart = fixture.debugElement.query(By.css('.icon:not(.filled)'));
    expect(emptyHeart).toBeTruthy();
  });

  it('should call onToggleFavorite when favorite button clicked', () => {
    spyOn(component, 'onToggleFavorite');
    component.showRemoveButton = false;
    fixture.detectChanges();
    
    const favoriteBtn = fixture.debugElement.query(By.css('.favorite-btn'));
    favoriteBtn.nativeElement.click();
    
    expect(component.onToggleFavorite).toHaveBeenCalled();
  });

  it('should call onRemove when remove button clicked', () => {
    spyOn(component, 'onRemove');
    component.showRemoveButton = true;
    fixture.detectChanges();
    
    const deleteBtn = fixture.debugElement.query(By.css('.delete-btn'));
    deleteBtn.nativeElement.click();
    
    expect(component.onRemove).toHaveBeenCalled();
  });

  it('should show router link when ID is available', () => {
    fixture.detectChanges();
    
    const titleLink = fixture.debugElement.query(By.css('.place-title.link'));
    expect(titleLink).toBeTruthy();
    expect(titleLink.attributes['ng-reflect-router-link']).toContain('/places,test-place-123');
  });

  it('should show plain title when no ID available', () => {
    component.place = { ...mockPlace, place_id: undefined };
    fixture.detectChanges();
    
    const plainTitle = fixture.debugElement.query(By.css('.place-title:not(.link)'));
    expect(plainTitle).toBeTruthy();
  });
});