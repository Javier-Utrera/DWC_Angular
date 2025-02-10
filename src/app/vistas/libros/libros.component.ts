import { Component, OnInit } from '@angular/core';
import { GoogleBooksService } from '../../servicios/google-books.service';
import { FormsModule } from '@angular/forms'; 
import { LibroCardComponent } from '../../componentes/libro-card/libro-card.component';


@Component({
  selector: 'app-libros',
  imports: [FormsModule,LibroCardComponent],
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent {
  terminoBusqueda: string = '';  // Variable para almacenar el término de búsqueda
  libros: any[] = [];  // Array donde almacenaremos los libros obtenidos
  cargando: boolean = false;  // Estado de carga

  constructor(private googleBooksService: GoogleBooksService) {}

  // Método para buscar libros
  buscarLibros() {
    if (this.terminoBusqueda.trim() === '') {
      return; // Si el término de búsqueda está vacío no hacer nada
    }

    this.cargando = true;  // Activar el estado de carga

    // Llamamos al servicio de Google Books con el término de búsqueda
    this.googleBooksService.buscarLibros(this.terminoBusqueda).subscribe(
      (response: any) => {
        this.libros = response.items || [];  // Asignamos los libros si existen
        this.cargando = false;  // Desactivamos el estado de carga
      },
      (error) => {
        console.error('Error al buscar libros', error);
        this.cargando = false;
      }
    );
  }
}
