import { Component, Input, OnChanges } from '@angular/core';
import { GoogleBooksService } from '../../servicios/google-books.service';
import { LibroCardComponent } from '../libro-card/libro-card.component';

@Component({
  selector: 'app-resultados',
  imports: [LibroCardComponent],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent implements OnChanges {
  @Input() terminoBusqueda: string = '';
  @Input() maxResults: number = 10;
  @Input() startIndex: number = 0;
  @Input() idioma?: string;
  @Input() region?: string;
  @Input() intitle?: string;
  @Input() inauthor?: string;

  libros: any[] = [];
  paginaActual: number = 0;

  constructor(private googleBooksService: GoogleBooksService) { }

  ngOnChanges() {
    this.buscarLibros();
  }

  buscarLibros() {
    if (this.terminoBusqueda.trim()) {
      this.googleBooksService.buscarLibros(
        this.terminoBusqueda,
        this.maxResults,
        this.startIndex = this.paginaActual * this.maxResults,
        this.idioma,
        this.region,
        this.intitle,
        this.inauthor
      ).subscribe({
        next: (data) => {
          this.libros = data.items || [];
        },
        error: (error) => {
          console.error('❌ Error al buscar libros:', error);
        },
        complete: () => {
          console.log('✅ Búsqueda completada');
        }
      });
    } else { 
      this.libros = [];     
    }
  }

  paginaSiguiente() {
    this.paginaActual++;
    this.buscarLibros();
  }

  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.buscarLibros();
    }
  }
}
