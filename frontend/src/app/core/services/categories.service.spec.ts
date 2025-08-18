import { TestBed } from '@angular/core/testing';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesService]
    });
    service = TestBed.inject(CategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return categories', () => {
    const categories = service.getCategories();
    
    expect(categories).toBeDefined();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0].label).toBeDefined();
    expect(categories[0].type).toBeDefined();
  });

  it('should include specific categories', () => {
    const categories = service.getCategories();
    const categoryTypes = categories.map(cat => cat.type);
    
    expect(categoryTypes).toContain('bar');
    expect(categoryTypes).toContain('cafe');
    expect(categoryTypes).toContain('restaurant');
  });

  it('should return categories with correct structure', () => {
    const categories = service.getCategories();
    const firstCategory = categories[0];
    
    expect(typeof firstCategory.label).toBe('string');
    expect(typeof firstCategory.type).toBe('string');
    expect(firstCategory.label.length).toBeGreaterThan(0);
    expect(firstCategory.type.length).toBeGreaterThan(0);
  });
});