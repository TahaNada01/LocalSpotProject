import { Routes } from '@angular/router';
import { RegisterComponent } from '../app/features/auth/register/register.component';

export const appRoutes: Routes = [
    { path: 'auth/register', component: RegisterComponent },
    // autre routes ici
    { path: '', redirectTo: 'auth/register', pathMatch: 'full' }, 
];
