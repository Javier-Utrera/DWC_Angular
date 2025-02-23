import { Component, Input, OnChanges } from '@angular/core';
import { GoogleBooksService } from '../../servicios/google-books.service';
import { LibroCardComponent } from '../libro-card/libro-card.component';

// para no tener que estar haciendo todo el rato 'libro : any', que me estaba dando muchos quebraderos de cabeza en algunos metodos, he hecho que cada vez que hago 'libro : Libro'
// ya sabe angular los atributos que va tener mi libro y de que tipo son
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
  imports: [LibroCardComponent],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
// para poder hacer que este componente sea 'reactivo' y ejecute el metodo ngOnChanges cada vez que yo cambio uno de los valores de las variables que tengo definidas con el @input
export class ResultadosComponent implements OnChanges {
  @Input() terminoBusqueda: string = '';
  @Input() orderBy: string = 'relevance';
  @Input() maxResults: number = 20;
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
    // si cambio el valor de orden, oredenara los libros de manera ascendente o descente
    if (this.orden) {
      console.log(`ngOnChanges ha cambiado, el orden es: ${this.orden}`);
      this.ascendente = !this.ascendente;
      this.ordenarLibros();
    // en caso contrario ejecutara el metodo buscarLibros que es el que usa el observable de mi servicio
    } else {
      this.buscarLibros();
    }
  }


  buscarLibros() {
    //aqui vuelvo hacer una validacion para que almenos unos de mis atributos tenga valor para ejecutar la busqueda, como yo ejecuto esta funcion cada vez que escribo algo en los inpit
    //si borro todo lo que tengo en dichos inputs, ejecuto resetResultados y vacio los arrays de libros
    if (!(this.terminoBusqueda.trim() || this.intitle?.trim() || this.inauthor?.trim() || this.subject?.trim())) {
      this.resetResultados();
      return;
    }
    // cuando buscamos un libro en google api, este nos puede devolver miles de libros, pero solo nos puede traer 40 como maximo por consulta, startIndex es el indice desde que la api de google libros
    // empieza a devolver libros, lo explico
    //  este valor lo calculamos mirando la pagina actual, que la definimos arriba en 0, y el resultado maximo que por ejemplo es 20, al multiplicarlo nos da la primera vez 0,
    // asi que nos devolvera los 20 primeros libros de la busqueda
    // pero cuando estemos en la pagina 1, lo volvemos a multiplicar por 20 , y nos da 20,
    // que hace la api, que omite los primeros 20 libros de los resultados y te devuelve los siguientes 20
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
      //si el subscribe ha tenido exito nos toca procesar la informacion
      next: (data) => this.procesarResultados(data),
      error: (error) => console.error('Error en la búsqueda:', error)
    });
  }

  procesarResultados(data: any) {
    console.log("Libros Antes de comprobar las portadas:" + data.items.length);
    // aqui lo primero que voy a validar son aquellos libros en el json que tengan imagen, ya que quiero mostrar solo libros con imagenes
    const libros = (data.items || []).filter((libro: Libro) => libro.volumeInfo?.imageLinks?.thumbnail);
    console.log("Libros Despues de comprobar las portadas:" + libros.length);
    // ahora cuento el numero de registros que tiene mi json y lo vuelvo en la variable totalLibros, en el raro caso de que los 20 libros que me devuelva, ninguno tenga portada y hago .totalItems
    // me daria un error, asi que le doy el valor 0
    this.totalLibros = data.totalItems || 0;
    // google libros en teoria te filta pos categoria, pero revisando los json veo que vienen libros con categorias que no corresponde asi que me querido asegurar que solo veo libros de la categoria
    // que yo indique
    this.filtrarPorCategoria(libros);
  }

  filtrarPorCategoria(libros: Libro[]) {
    // ahora mis libros los voy a volcar en librosFiltrados, en caso de que haya introducido una categoria en el componente, mirara en el array de categorias que tiene el libro si contiene
    // alguna categoria que sea la que yo le he indicado, en caso de que no haya seleccionado ninguna categoria, uso todos los libros
    this.librosFiltrados = this.categoriaSeleccionada
      ? libros.filter((libro: Libro) => libro.volumeInfo.categories?.includes(this.categoriaSeleccionada!))
      : libros;
    // esto lo creo para que salga en consola los libros que hay dentro de librosFiltrados en caso de que haya indicado una categoria
    if (this.categoriaSeleccionada) {
      console.log("Libros Filtrados:" + this.librosFiltrados.length + this.categoriaSeleccionada);
      this.librosFiltrados.forEach((libro) => {
        // imprimo cada libro por consola, por ejemplo El camino de los reyes - Categoria: fantasy (y como categoria es una array de sting en el libro las aplano en un solo string separados por ,)
        console.log(`${libro.volumeInfo.title} - Categoría: ${libro.volumeInfo.categories?.join(', ') || 'Sin categoría'}`);
      });
    }
    // no queria que todos los libros me los devolviera en una misma fila, me he complicado mucho con boostrap y como paginarlos en dos filas, asi que decidi que los resultados que me enviara google
    // lo tenia que devidir un dos arraym una array de libros para cada fila
    this.dividirEnFilas();
  }

  ordenarLibros() {
    // en caso de que no haya libros, no ordenamos nada
    if (!this.librosFiltrados.length) return;
  
    console.log(`Intentando ordenar por: ${this.orden} en orden ${this.ascendente ? 'ascendente' : 'descendente'}`);
    // he querido hacer que el mismo metodo me ordenara por titulo y por fecha, ademas que cada vez que le diera al boton fuera de manera ascendente y luego descendente
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
    // vuelvo a dividir por filas mi array de libros
    this.dividirEnFilas();
  }
  

  dividirEnFilas() {
    this.primeraFila = [];
    this.segundaFila = [];
    // manejo de libros simple, voy mirando el resto del indice y si es par, para la primera fila y si es impar para la segunda fila
    this.librosFiltrados.forEach((libro, index) => {
      if (index % 2 === 0) {
        this.primeraFila.push(libro);
      } else {
        this.segundaFila.push(libro);
      }
    });
  }

  paginaSiguiente() {
    // aqui lo que hago es que el usuario no pueda darle al boton de siguiente indefinidamente, solo le dara si hay datos para mostrar
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
