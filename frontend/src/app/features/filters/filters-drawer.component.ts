import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../core/services/categories.service';

@Component({
  selector: 'app-filters-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters-drawer.component.html',
  styleUrls: ['./filters-drawer.component.scss']
})
export class FiltersDrawerComponent implements OnInit {
  @Input() currentCity: string = '';
  @Input() currentType: string = '';
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() applyFilters = new EventEmitter<{ city: string; type: string }>();

  ville: string = '';
  type: string = '';
  selectedCategory: string = '';
  categories: any[] = [];

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.ville = this.currentCity || 'Paris';
    this.type = this.currentType || 'bar';
    this.selectedCategory = this.type;

    this.categories = this.categoriesService.getCategories();
  }

  setCategory(type: string) {
  this.type = type;
  this.selectedCategory = type;
  }

  resetFilters() {
  this.ville = 'Paris';
  this.setCategory('bar');
  }

  apply() {
    this.applyFilters.emit({ city: this.ville.trim(), type: this.type });
 }

  close() {
    this.closeDrawer.emit();
  }
}

