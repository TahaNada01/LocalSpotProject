import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { FavoritesComponent } from './features/favorites/favorites.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      {
        path: 'map',
        loadComponent: () => import('./features/map/map.component').then(m => m.MapComponent) 
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      { path: 'favorites', component: FavoritesComponent },
      {
        path: 'places/:placeId',
        loadComponent: () =>
          import('./features/place-details/place-details.component')
            .then(m => m.PlaceDetailsComponent)
      },
      {
        path: 'add-place',
        loadComponent: () =>
          import('./features/add-place/add-place.component')
            .then(m => m.AddPlaceComponent)
      },
      {
        path: 'community',
        loadComponent: () =>
          import('./features/community/community.component')
            .then(m => m.CommunityComponent)
      },

    ]
  }
];
