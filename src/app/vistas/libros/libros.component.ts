import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ResultadosComponent } from '../../componentes/resultados/resultados.component';



@Component({
  selector: 'app-libros',
  imports: [FormsModule,ResultadosComponent],
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent {
  terminoBusqueda: string = '';
}