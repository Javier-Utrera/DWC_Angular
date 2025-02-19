import { Component, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-vista-previa',
  standalone: true,
  templateUrl: './vista-previa.component.html',
  styleUrl: './vista-previa.component.css'
})
export class VistaPreviaComponent implements OnChanges {
  @Input() libroId!: string;
  @ViewChild('viewerCanvas', { static: false }) viewerCanvas!: ElementRef;

  static apiCargada = false;
  reintentos = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['libroId'] && this.libroId) {
      console.log(`📖 Cambio detectado. Cargando vista previa para ID: ${this.libroId}`);
      this.inicializarGoogleBooksAPI();
    }
  }

  //Verifica y carga la API de Google Books
  inicializarGoogleBooksAPI() {
    if (typeof google !== 'undefined' && google.books) {
      console.log("✅ Google Books API ya está cargada.");
      this.cargarVistaPrevia();
      return;
    }

    if (!VistaPreviaComponent.apiCargada) {
      this.cargarScriptGoogleBooks();
    } else {
      this.reintentarCargaAPI();
    }
  }

  //Carga el script de la API si no existe
  cargarScriptGoogleBooks() {
    console.log("Cargando API...");

    const script = document.createElement('script');
    script.src = "https://www.google.com/books/jsapi.js";

    script.onload = () => {
      VistaPreviaComponent.apiCargada = true;
      console.log("API cargada correctamente.");
      this.reintentarCargaAPI();
    };

    document.head.appendChild(script);
  }


  reintentarCargaAPI() {
    if (typeof google !== 'undefined' && google.books) {
      google.books.load('preview');
      setTimeout(() => this.cargarVistaPrevia(), 500);
    }
  }

  //Carga la vista previa del libro en el visor
  cargarVistaPrevia() {

    console.log(`Cargando vista ID libro : ${this.libroId}`);

    // Limpiar el contenedor
    this.viewerCanvas.nativeElement.innerHTML = "";

    const viewer = new google.books.DefaultViewer(this.viewerCanvas.nativeElement);
    viewer.load(this.libroId);
    console.log("✅ Vista previa cargada con éxito.");
  }
}
