import { Component, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-vista-previa',
  standalone: true,
  templateUrl: './vista-previa.component.html',
  styleUrl: './vista-previa.component.css'
})
// Este es el componente que mas me ha costado hacer con diferencia, porque esta api que proporciona google "https://www.google.com/books/jsapi.js", no esta pensada para usarse en angular y le explico el porque
// como angular no recargamos el index.html nunca , este script esta hecho para que solamente puede estar cargado una vez en el dom para mostrarte solo un libro,
// si fuera un proyecto que no genera las cargas de componentes como angular pues navego a otro html y se recargaria el dom y el script con el
// lo he probado todo, elminar el script del dom cuando estaba en ejecucion para volver a cargalo, cosa que literalmente me explotaba el proyecto y hasta me cerraba el contenedor docker
// asi que despues de encabezonarme en hacer esto, opte porque si bien solo podia tener el script cargado una vez en el proyecto, podia  crear un canvas , volcar ahi el contenido y limpiar el canvas donde tenia cargado la vista previa del libro
// 
export class VistaPreviaComponent implements OnChanges {
  @Input() libroId!: string;
  @ViewChild('viewerCanvas', { static: false }) viewerCanvas!: ElementRef;

  static apiCargada = false;
  reintentos = 0;

  ngOnChanges(changes: SimpleChanges) {
    //lo ejecuto cada vez que al componente se le cambia el libroId y ademas tiene un valor
    if (changes['libroId'] && this.libroId) {
      console.log(`Cambio detectado cargando vista previa para ID: ${this.libroId}`);
      this.inicializarGoogleBooksAPI();
    }
  }

  //Verifica y carga la API de Google Books
  inicializarGoogleBooksAPI() {
    // miro si el tipo de mi variable de google es null y existe
    if (typeof google !== 'undefined' && google.books) {
      console.log("Google Books API ya esta cargada.");
      // si no es null y existe es que se ha cargado el script en el dom y puedo ejecutar cargarVistaPrevia
      this.cargarVistaPrevia();
      return;
    }
    // si apiCargada es falso
    if (!VistaPreviaComponent.apiCargada) {
      // cargo el script en el dom
      this.cargarScriptGoogleBooks();
    } else {
      // en caso contrario vuelvo a intentar cargar la api
      this.reintentarCargaAPI();
    }
  }

  //Carga el script de la API si no existe
  cargarScriptGoogleBooks() {
    console.log("Cargando API...");

    const script = document.createElement('script');
    script.src = "https://www.google.com/books/jsapi.js";
    // scuando es script se carga correctamente se actualiza el variable estatica apiCargada e intenta cargar la vista previa
    script.onload = () => {
      VistaPreviaComponent.apiCargada = true;
      console.log("API cargada correctamente.");
      this.reintentarCargaAPI();
    };
    // añado el script en el head del index.html
    document.head.appendChild(script);
  }


  reintentarCargaAPI() {
    if (typeof google !== 'undefined' && google.books) {
      google.books.load('preview');
      // le damos un retraso de tiempo que le damos a la api para cargar el modulo de vista previa que es donde volvamos la preview del libro
      setTimeout(() => this.cargarVistaPrevia(), 500);
    }
  }

  //Carga la vista previa del libro en el visor
  cargarVistaPrevia() {
    console.log(`cargando vista ID libro : ${this.libroId}`);

    // limpio el contenedor siempre antes de cargar el elemento 
    this.viewerCanvas.nativeElement.innerHTML = "";
    // y aqui creo el visor de la api de google books, el script solo puedo cargarlo un vez, pero puedo crear tantos viewer como quiera, que es la cajita donde veo el libro
    // creado en el html <div #viewerCanvas class="viewer-frame border rounded shadow-sm" style="width: 100%; height: 500px; min-height: 500px;"></div>
    //  indicando que en ese div vamos a cargar el libro con el id this.libroId
    const viewer = new google.books.DefaultViewer(this.viewerCanvas.nativeElement);
    viewer.load(this.libroId);
    console.log(" Vista previa cargada con éxito.");
  }
}
