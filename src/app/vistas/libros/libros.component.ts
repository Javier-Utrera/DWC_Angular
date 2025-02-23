import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ResultadosComponent } from '../../componentes/resultados/resultados.component';

@Component({
  selector: 'app-libros',
  imports: [FormsModule, ResultadosComponent],
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent {
  terminoBusqueda: string = '';
  intitle: string = '';
  inauthor: string = '';
  orden: string = '';
  ascendente : boolean = false

  ordenarPor(tipo: 'titulo' | 'fecha') {
    this.orden = tipo;
    this.ascendente = !this.ascendente;
    console.log(`Se cambió el orden a: ${this.orden}` + this.ascendente);
  }
}
