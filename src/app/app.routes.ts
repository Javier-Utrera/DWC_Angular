import { Routes } from '@angular/router';
import { InicioComponent } from './vistas/inicio/inicio.component';
import { ContactoComponent } from './vistas/contacto/contacto.component';
import { LibrosComponent } from './vistas/libros/libros.component';

export const routes: Routes = [
  { path: '', component: InicioComponent }, // Página de inicio
  { path: 'libros', component: LibrosComponent }, // Página de libros
  { path: 'contacto', component: ContactoComponent }, // Página de contacto
];
