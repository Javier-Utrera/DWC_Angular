import { Component, OnInit, signal } from '@angular/core';
import { FavoritosService } from '../../servicios/favoritos.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-biblioteca',
  imports: [],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.css'
})
export class BibliotecaComponent implements OnInit {
  usuario: any = null;
  favoritos: any[] = [];
  cargando = true;

  constructor(public authService: AuthService, public favoritosService: FavoritosService) {}

  ngOnInit(): void {
    this.authService.obtenerUsuario().subscribe(user => {
      this.usuario = user;
      if (user) {
        this.cargarFavoritos();
      } else {
        this.cargando = false;
      }
    });
  }


  public cargarFavoritos() {
    this.favoritosService.obtenerFavoritos().subscribe(libros => {
      this.favoritos = libros;
    });
  }


  eliminarFavorito(idFavorito: string) {
    this.favoritosService.eliminarFavorito(idFavorito)
      .then(() => {
        console.log("✅ Libro eliminado de favoritos.");
        this.favoritos = this.favoritos.filter(libro => libro.id !== idFavorito);
      })
      .catch(error => console.error("Error al eliminar favorito:", error));
  }
}
