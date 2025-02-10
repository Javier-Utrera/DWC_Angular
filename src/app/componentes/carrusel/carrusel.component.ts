import { Component, OnInit } from '@angular/core';
import { GoogleBooksService } from '../../servicios/google-books.service';

@Component({
  selector: 'app-carrusel',
  standalone: true,  // Define el componente como standalone,
  imports:[],
  providers: [GoogleBooksService], // Inyectar el servicio usando providers
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css'],
})
export class CarruselComponent implements OnInit {
  imagenes: string[] = [];

  constructor(private servicioLibros: GoogleBooksService) {}

  ngOnInit(): void {
    this.servicioLibros.buscarLibros('Brandon Sanderson','','','Reyes','').subscribe((respuesta) => {
      
      console.log(respuesta);

      this.imagenes = respuesta.items
        .map((libro: any) => libro.volumeInfo.imageLinks?.thumbnail)
    });
  }
}
