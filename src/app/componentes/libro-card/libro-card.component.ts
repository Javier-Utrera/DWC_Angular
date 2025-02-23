import { Component,Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FavoritosService } from '../../servicios/favoritos.service';

@Component({
  selector: 'app-libro-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './libro-card.component.html',
  styleUrl: './libro-card.component.css'
})
export class LibroCardComponent {
  @Input() libro: any;
  // he mirado que con signal podemos hacer que un atributo sea reactivo, si este valor cambia hara que se ejecute nuevamente el ngOnInit,
  // si quisieramos cambiarle el valor se lo cambiariamos con this.esFavorito.set(true);
  esFavorito = signal(false);
  idFavorito: string = '';

  constructor(public favoritosService: FavoritosService) {}

  async ngOnInit() {
    // cada vez que el libro que le paso al componente cambia veo en la base de datos de firebase si el id del libro lo tengo en mis registros de favoritos o no , para que en el .html
    // se cambie el boton de añadir de favoritos o quitar de favoritos en cada libro, ademas cada vez que cargo el componente de libro, voy a mirar si esta en favoritos, asi que el libro
    // en mi aplicacion siempre sabara el usuario si esta o no el libro en sus favoritos mientras navega por ellos
    this.favoritosService.obtenerFavoritos().subscribe(favoritos => {
      const favorito = favoritos.find(fav => fav.libroId === this.libro.id);
      if (favorito) {
        this.esFavorito.set(true);
        this.idFavorito = favorito.id;
      }
    });
  }

  async toggleFavorito() {
    console.log("Intentando agregar libro:", this.libro);
    // si es favorito lo elimina
    if (this.esFavorito()) {
      await this.favoritosService.eliminarFavorito(this.idFavorito);
      this.esFavorito.set(false);
    // y si no pues lo añade
    } else {
        const docRef = await this.favoritosService.agregarFavorito(this.libro);
        this.idFavorito = docRef.id;
        this.esFavorito.set(true);
      }
  }
}
