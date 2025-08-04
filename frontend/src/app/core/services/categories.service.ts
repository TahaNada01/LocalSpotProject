// src/app/services/categories.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categories = [
    { label: 'Bars', type: 'bar' }, 
    { label: 'Cafe', type: 'cafe' },
    { label: 'Libraries', type: 'library' },
    { label: 'Parks', type: 'park' },
    { label: 'Restaurants', type: 'restaurant' },
    { label: 'Museums', type: 'museum' },
    { label: 'Gyms', type: 'gym' }
  ];

  getCategories() {
    return this.categories;
  }
}
