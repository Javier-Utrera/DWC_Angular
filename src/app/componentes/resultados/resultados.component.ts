import { Component, Input, OnChanges } from '@angular/core';
import { GoogleBooksService } from '../../servicios/google-books.service';
import { LibroCardComponent } from '../libro-card/libro-card.component';

interface Libro {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate: string;
  };
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [LibroCardComponent],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnChanges {
  @Input() terminoBusqueda: string = '';
  @Input() orderBy: string = 'relevance';
  @Input() maxResults: number = 20; // 🔥 Siempre traemos 20 libros
  @Input() startIndex: number = 0;

  @Input() orden?: string = '';
  @Input() ascendente?: boolean;
  @Input() categoriaSeleccionada?: string;
  
  @Input() idioma?: string;
  @Input() region?: string;

  @Input() intitle?: string;
  @Input() inauthor?: string;
  @Input() subject?: string;





  librosFiltrados: Libro[] = [];
  primeraFila: Libro[] = [];
  segundaFila: Libro[] = [];
  paginaActual: number = 0;
  totalLibros: number = 0;

  constructor(private googleBooksService: GoogleBooksService) { }

  ngOnChanges() {
    console.log(`🔄 ngOnChanges detectó un cambio. Nuevo orden: ${this.orden}`);

    if (this.orden) {
      this.ascendente = !this.ascendente; // 🔄 Alternar orden
      this.ordenarLibros();
    } else {
      this.buscarLibros();
    }
  }


  buscarLibros() {
    if (!(this.terminoBusqueda.trim() || this.intitle?.trim() || this.inauthor?.trim() || this.subject?.trim())) {
      this.resetResultados();
      return;
    }

    this.startIndex = this.paginaActual * this.maxResults;

    this.googleBooksService.buscarLibros(
      this.terminoBusqueda,
      this.maxResults,
      this.startIndex,
      this.orderBy,
      this.idioma,
      this.region,
      this.intitle,
      this.inauthor,
      this.subject
    ).subscribe({
      next: (data) => this.procesarResultados(data),
      error: (error) => console.error('Error en la búsqueda:', error)
    });
  }

  procesarResultados(data: any) {
    const libros = (data.items || []).filter((libro: Libro) => libro.volumeInfo?.imageLinks?.thumbnail);
    this.totalLibros = data.totalItems || 0;
    this.filtrarPorCategoria(libros);
  }

  filtrarPorCategoria(libros: Libro[]) {
    this.librosFiltrados = this.categoriaSeleccionada
      ? libros.filter((libro: Libro) => libro.volumeInfo.categories?.includes(this.categoriaSeleccionada!))
      : libros;

    console.log("📚 Libros Filtrados:" + this.librosFiltrados.length + this.categoriaSeleccionada);
    if (this.categoriaSeleccionada) {
      this.librosFiltrados.forEach((libro) => {
        console.log(`📖 ${libro.volumeInfo.title} - Categoría: ${libro.volumeInfo.categories?.join(', ') || 'Sin categoría'}`);
      });
    }

    this.dividirEnFilas();
  }

  ordenarLibros() {
    if (!this.librosFiltrados.length) return; // Si no hay libros, no hacemos nada
  
    console.log(`🔄 Intentando ordenar por: ${this.orden} en orden ${this.ascendente ? 'ascendente' : 'descendente'}`);
  
    if (this.orden === 'titulo') {
      this.librosFiltrados.sort((a, b) => {
        const tituloA = a.volumeInfo.title?.toLowerCase() || '';
        const tituloB = b.volumeInfo.title?.toLowerCase() || '';
        return this.ascendente ? tituloA.localeCompare(tituloB) : tituloB.localeCompare(tituloA);
      });
    } else if (this.orden === 'fecha') {
      this.librosFiltrados.sort((a, b) => {
        const fechaA = a.volumeInfo.publishedDate || '';
        const fechaB = b.volumeInfo.publishedDate || '';
        return this.ascendente ? fechaA.localeCompare(fechaB) : fechaB.localeCompare(fechaA);
      });
    }
    this.dividirEnFilas();
  
    console.log("✅ Libros después de ordenar:", JSON.stringify(this.librosFiltrados.map(l => l.volumeInfo.title)));
  }
  

  dividirEnFilas() {
    this.primeraFila = [];
    this.segundaFila = [];

    this.librosFiltrados.forEach((libro, index) => {
      if (index % 2 === 0) {
        this.primeraFila.push(libro);
      } else {
        this.segundaFila.push(libro);
      }
    });
  }

  paginaSiguiente() {
    if ((this.paginaActual + 1) * this.maxResults < this.totalLibros) {
      this.paginaActual++;
      this.buscarLibros();
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.buscarLibros();
    }
  }

  resetResultados() {
    this.librosFiltrados = [];
    this.primeraFila = [];
    this.segundaFila = [];
  }
}
