import { Routes } from '@angular/router';
import { InicioComponent } from './vistas/inicio/inicio.component';
import { ContactoComponent } from './vistas/contacto/contacto.component';
import { LibrosComponent } from './vistas/libros/libros.component';
import { LibroDetalleComponent } from './componentes/libro-detalle/libro-detalle.component';
import { BibliotecaComponent } from './vistas/biblioteca/biblioteca.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'libros', component: LibrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'libro/:id', component: LibroDetalleComponent },
  { path: 'biblioteca', component: BibliotecaComponent },
];
