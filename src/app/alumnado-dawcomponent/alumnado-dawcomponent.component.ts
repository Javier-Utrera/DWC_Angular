import { Component } from '@angular/core';
import { Alumno } from './Alumno';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alumnado-dawcomponent',
  imports: [CommonModule],
  templateUrl: './alumnado-dawcomponent.component.html',
  styleUrl: './alumnado-dawcomponent.component.css'
})
export class AlumnadoDAWComponentComponent {
  listaAlumnos: Array<Alumno>;
  bandera:boolean;
  constructor() {
    this.bandera=true;
    this.listaAlumnos = [
      new Alumno(
        "Javier",
        "Rodriguez",
        "43221643C",
        new Date("1994-10-15"),
        "Utrera",
        698924330,
        2,
        ["Cliente", "Servidor"]),
      new Alumno(
        "Javier2",
        "Rodriguez2",
        "43221643C",
        new Date("1994-10-15"),
        "Utrera",
        698924330,
        2,
        ["Cliente", "Servidor"])
    ];
  }
  mostrar(numero:number){
    return this.listaAlumnos.filter(alumno=>alumno.curso==numero);
  }
}
