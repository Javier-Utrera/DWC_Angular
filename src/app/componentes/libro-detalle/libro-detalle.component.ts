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

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    //cada vez que cambios los parametros en la url, osea el id del libro se ejecuta cargarLibro, imprescindible si quiero navegar de un libro-detalle a otro libro-detalle directamente
    this.route.paramMap.subscribe(() => {
      this.cargarLibro();
    });
  }

  intercambiar() {
    this.bandera = !this.bandera;
  }

  cargarLibro() {
    // window.history.state es un objeto que tiene la informacion que se parasaron al entrar en la pagina, osea para acceder a libro-detalle hay que pasarle un libro
    const navigation = window.history.state;
    // asigno ese libro que tengo en el windwow.history.state a this.libro
    // todo esto lo he teniedo que hacer porque he usado otra api de google libros para incrustar la vista previa en la misma pagina, con el componenete vista-previa
    // para hacer que el this.libroId que necesita el componente vista-previa cambie correctamente y se vuelva a actualizar el componenete vista-previa
    this.libro = navigation?.libro;

    console.log("datos del libro recibidos:", this.libro);
    // he tenido que hacer varios setTimeout en el proyecto, porque el dom tardaba algo de tiempo en cargarse , y como meto el script de la api directament en el dom, tenia que esperar que el script estuviera cargado
    // antes de cambiar el valor libroId del componente vistra-previa
    setTimeout(() => {
      this.libroId = this.libro.id;
      console.log(`Pasando ID a VistaPreviaComponent: ${this.libroId}`);
    }, 200);
  }

  buscarPorAutor(autor: string) {
    console.log(`Buscando libros de: ${autor}`);
    this.autorSeleccionado = autor;
    this.bandera = true;
  }

  abrirVistaPrevia() {
    //abro en una ventana nueva el link que tiene el libro de vista previa proporcionado por la api de google books
    window.open(this.libro.volumeInfo.previewLink, '_blank', 'width=1200,height=1080');
  }
}
