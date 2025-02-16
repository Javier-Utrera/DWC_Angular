import { Component, OnInit,} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResultadosComponent } from '../resultados/resultados.component';

@Component({
  selector: 'app-libro-detalle',
  imports: [RouterModule,ResultadosComponent],
  templateUrl: './libro-detalle.component.html',
  styleUrl: './libro-detalle.component.css'
})
export class LibroDetalleComponent implements OnInit {
  libro: any;
  autorSeleccionado: string = '';
  bandera : boolean = false;

  constructor(private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
    this.cargarLibro();
    this.route.paramMap.subscribe(() => {
      this.cargarLibro();
    });
  }

  intercambiar() {
    this.bandera = !this.bandera;
  }

  cargarLibro() {
    const navigation = window.history.state;
    console.log("Navegación:", navigation);
    this.libro = navigation?.libro;

    if (!this.libro) {
      console.warn("No se encontró el libro en el estado de navegación.");
      this.router.navigate(['/libros']);
    } else {
      console.log("Datos del libro recibidos:", this.libro);
    }
  }

  buscarPorAutor(autor: string) {
    console.log(`🔍 Buscando libros de: ${autor}`);
    this.autorSeleccionado = autor;
    this.bandera = true; // 🔥 Cambia la vista a "Libros del Autor"
  }

  abrirVistaPrevia() {
    if (this.libro?.volumeInfo?.previewLink) {
      window.open(this.libro.volumeInfo.previewLink, '_blank', 'width=1200,height=1080');
    } else {
      console.warn("No hay vista previa disponible para este libro");
    }
  }
}
