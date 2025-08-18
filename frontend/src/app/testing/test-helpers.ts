// src/app/testing/test-helpers.ts
import { of } from 'rxjs';

// Mock data factories
export const createMockUser = (overrides = {}) => ({
  id: 1,
  nom: 'Test User',
  email: 'test@example.com',
  ville: 'Paris',
  role: 'USER',
  profilPhoto: '',
  ...overrides
});

export const createMockPlace = (overrides = {}) => ({
  place_id: 'test-place-id',
  name: 'Test Place',
  formatted_address: '123 Test Street, Paris',
  rating: 4.5,
  opening_hours: { open_now: true },
  photos: [{ photo_reference: 'test-photo-ref' }],
  types: ['restaurant'],
  geometry: { location: { lat: 48.8566, lng: 2.3522 } },
  ...overrides
});

export const createMockFavorite = (overrides = {}) => ({
  name: 'Test Favorite',
  address: '123 Test Street',
  placeId: 'test-place-id',
  photoReference: 'test-photo-ref',
  rating: 4.5,
  openNow: true,
  ...overrides
});

// Mock services
export const createMockAuthService = () => ({
  login: jest.fn(() => of({ token: 'test-token', refreshToken: 'refresh-token' })),
  register: jest.fn(() => of({})),
  getCurrentUser: jest.fn(() => of(createMockUser())),
  updateUser: jest.fn(() => of({ token: 'new-token', refreshToken: 'new-refresh' })),
  refreshToken: jest.fn(() => of({ token: 'new-token', refreshToken: 'refresh-token' })),
  logout: jest.fn()
});

export const createMockPlaceService = () => ({
  getPlaces: jest.fn(() => of({ results: [createMockPlace()] })),
  getPlaceDetails: jest.fn(() => of(createMockPlace())),
  getPhotoUrl: jest.fn(() => 'http://test-photo-url.com'),
  getNextPage: jest.fn(() => of({ results: [createMockPlace()] }))
});

export const createMockFavoritesService = () => ({
  getFavorites: jest.fn(() => of([createMockFavorite()])),
  addFavorite: jest.fn(() => of(createMockFavorite())),
  deleteFavorite: jest.fn(() => of(''))
});