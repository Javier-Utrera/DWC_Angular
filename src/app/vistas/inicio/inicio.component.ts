import { Component } from '@angular/core';
import { CarruselComponent } from '../../componentes/carrusel/carrusel.component';
import { RouterModule } from '@angular/router';
import { ResultadosComponent } from '../../componentes/resultados/resultados.component';

@Component({
  selector: 'app-inicio',
  imports: [CarruselComponent,RouterModule,ResultadosComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  terminoBusqueda: string = '';  
  orderBy: string = ''; 
  maxResults: number = 20;

  mostrarCategorias: boolean = false;
  categoriaSeleccionada: string = '';
  categorias: string[] = [
    'Fiction', 'Drama', 'Science', 'Humor', 'History', 'Pets', 'Cooking', 'Nature'
  ];

  abrirCategorias() {
    this.mostrarCategorias = !this.mostrarCategorias;
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.terminoBusqueda = ''; 
  }

  buscarNovedades() {
    this.categoriaSeleccionada='';
    this.terminoBusqueda = 'books';
    this.orderBy = 'newest';
  }

  buscarMejorValorados() {
    this.categoriaSeleccionada='';
    this.terminoBusqueda = 'books';
    this.orderBy = 'relevance';
  }
}
