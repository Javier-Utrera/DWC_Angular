import { Component, OnInit, signal } from '@angular/core';
import { FavoritosService } from '../../servicios/favoritos.service';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.css'
})
export class BibliotecaComponent implements OnInit {
  librosFavoritos = signal<any[]>([]); // 🔥 Variable reactiva para los libros

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit() {
    this.favoritosService.obtenerFavoritos().subscribe(libros => {
      this.librosFavoritos.set(libros);
    });
  }
  async eliminarFavorito(idFavorito: string) {
    await this.favoritosService.eliminarFavorito(idFavorito);
    this.librosFavoritos.set(this.librosFavoritos().filter(libro => libro.id !== idFavorito));
  }
  
}
