import { Component, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-vista-previa',
  standalone: true,
  templateUrl: './vista-previa.component.html',
  styleUrl: './vista-previa.component.css'
})
export class VistaPreviaComponent implements OnChanges {
  @Input() libroId!: string; // 📖 Recibe el ID del libro como parámetro
  @ViewChild('viewerCanvas', { static: false }) viewerCanvas!: ElementRef;

  private static apiCargada = false; // 🚀 Evita recargar la API varias veces

  ngOnChanges(changes: SimpleChanges) {
    if (changes['libroId'] && this.libroId) {
      console.log(`📖 Se detectó un cambio de libro. Nuevo ID: ${this.libroId}`);
      this.inicializarGoogleBooksAPI();
    }
  }

  private inicializarGoogleBooksAPI() {
    if (!this.libroId) {
      console.warn("⚠️ No hay libroId disponible para cargar Google Books API.");
      return;
    }

    console.log("🚀 Intentando cargar Google Books API...");

    if (!VistaPreviaComponent.apiCargada) {
      console.log("📢 Google Books API NO está cargada. Cargando script...");
      const script = document.createElement('script');
      script.src = "https://www.google.com/books/jsapi.js";
      script.onload = () => {
        VistaPreviaComponent.apiCargada = true;
        google.books.load('preview');
        google.books.setOnLoadCallback(() => this.cargarVistaPrevia());
      };
      document.head.appendChild(script);
    } else {
      console.log("✅ Google Books API ya estaba cargada.");
      this.cargarVistaPrevia();
    }
  }

  private cargarVistaPrevia() {
    if (!this.libroId || !this.viewerCanvas) {
      console.warn("⚠️ No se puede cargar la vista previa: Falta el ID del libro o el contenedor.");
      return;
    }

    console.log(`📖 Cargando vista previa para ID: ${this.libroId}`);

    this.viewerCanvas.nativeElement.innerHTML = ""; // 🔥 Limpiar visor anterior

    try {
      const viewer = new google.books.DefaultViewer(this.viewerCanvas.nativeElement);
      viewer.load(this.libroId);
      console.log("✅ Vista previa cargada con éxito.");
    } catch (error) {
      console.error("❌ Error al crear el visor de Google Books:", error);
    }
  }
}
