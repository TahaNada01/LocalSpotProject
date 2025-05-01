import { Routes } from '@angular/router';
import { RegisterComponent } from '../app/features/auth/register/register.component';
import { LoginComponent } from '../app/features/auth/login/login.component';
import { HomeComponent } from '../app/features/home/home.component';


export const appRoutes: Routes = [
    { path: 'auth/register', component: RegisterComponent },
    { path: 'auth/login', component: LoginComponent },
    {path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'auth/register', pathMatch: 'full' } //route par défaut
];
