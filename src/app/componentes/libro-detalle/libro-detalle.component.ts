import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  libroId: string = '';
  autorSeleccionado: string = '';
  bandera: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.cargarLibro();
    });
  }

  intercambiar() {
    this.bandera = !this.bandera;
  }

  cargarLibro() {
    const navigation = window.history.state;
    this.libro = navigation?.libro;

    console.log("📖 Datos del libro recibidos:", this.libro);

    setTimeout(() => {
      this.libroId = this.libro.id;
      console.log(`✅ Pasando ID a VistaPreviaComponent: ${this.libroId}`);
    }, 200);
  }

  buscarPorAutor(autor: string) {
    console.log(`Buscando libros de: ${autor}`);
    this.autorSeleccionado = autor;
    this.bandera = true;
  }

  abrirVistaPrevia() {
    window.open(this.libro.volumeInfo.previewLink, '_blank', 'width=1200,height=1080');
  }
}
