import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
//aqui inicializo firebase con el export que tengo en environment.ts
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
//aqui lo habilito, osea conecto con firebase
    provideFirestore(() => getFirestore()),
//y con esto puedo usar el sistema de autenticacion por google que me ofrece firebase
    provideAuth(() => getAuth())
  ]
};
