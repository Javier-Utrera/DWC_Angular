import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResultadosComponent } from '../resultados/resultados.component';
import { VistaPreviaComponent } from '../vista-previa/vista-previa.component';

@Component({
  selector: 'app-libro-detalle',
  imports: [RouterModule, ResultadosComponent, VistaPreviaComponent],
  templateUrl: './libro-detalle.component.html',
  styleUrl: './libro-detalle.component.css'
})
export class LibroDetalleComponent implements OnInit {
  libro: any;
  libroId: string = ''; // 📖 ID del libro para `VistaPreviaComponent`
  autorSeleccionado: string = '';
  bandera: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.cargarLibro();
    });
  }

  /** 🔄 Cambia entre mostrar libros relacionados y libros del autor */
  intercambiar() {
    this.bandera = !this.bandera;
  }

  /** 📖 Carga la información del libro desde el historial de navegación */
  cargarLibro() {
    const navigation = window.history.state;
    this.libro = navigation?.libro;

    if (!this.libro) {
      console.warn("⚠️ No se encontró el libro en el estado de navegación.");
      this.router.navigate(['/libros']);
      return;
    }

    console.log("📖 Datos del libro recibidos:", this.libro);

    // 🔥 Asegurar que `libroId` se actualiza correctamente antes de pasarlo al componente
    setTimeout(() => {
      this.libroId = this.libro.id;
      console.log(`✅ Pasando ID a VistaPreviaComponent: ${this.libroId}`);
    }, 100); // Pequeño delay para asegurar que el DOM está listo
  }

  /** 🔍 Busca libros del autor seleccionado */
  buscarPorAutor(autor: string) {
    console.log(`🔍 Buscando libros de: ${autor}`);
    this.autorSeleccionado = autor;
    this.bandera = true;
  }

  /** 📖 Abre la vista previa del libro en una nueva ventana */
  abrirVistaPrevia() {
    if (this.libro?.volumeInfo?.previewLink) {
      window.open(this.libro.volumeInfo.previewLink, '_blank', 'width=1200,height=1080');
    } else {
      console.warn("⚠️ No hay vista previa disponible para este libro.");
    }
  }
}
