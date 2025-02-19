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
  esFavorito = signal(false);
  idFavorito: string = '';

  constructor(public favoritosService: FavoritosService) {}

  async ngOnInit() {
    this.favoritosService.obtenerFavoritos().subscribe(favoritos => {
      const favorito = favoritos.find(fav => fav.libroId === this.libro.id);
      if (favorito) {
        this.esFavorito.set(true);
        this.idFavorito = favorito.id;
      }
    });
  }

  async toggleFavorito() {
    console.log("📚 Intentando agregar libro:", this.libro);
    if (this.esFavorito()) {
      await this.favoritosService.eliminarFavorito(this.idFavorito);
      this.esFavorito.set(false);
    } else {
        const docRef = await this.favoritosService.agregarFavorito(this.libro);
        this.idFavorito = docRef.id;
        this.esFavorito.set(true);
      }
  }
}
