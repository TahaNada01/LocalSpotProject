import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';

export const appConfig : ApplicationConfig = { 
  providers: [
    provideRouter(appRoutes),provideHttpClient()],
  };
