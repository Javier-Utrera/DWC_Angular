import { Component } from '@angular/core';
import { Empleado } from './Empleado';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-empleado',
  imports: [],
  templateUrl: './component-empleado.component.html',
  styleUrl: './component-empleado.component.css'
})
export class ComponentEmpleadoComponent {
  title: string = "Empleado Component";
  empleadoExt: Empleado;
  trabajador: Array<Empleado>;
  trabajadorExterno: boolean;

  constructor() {
    this.empleadoExt = new Empleado("Pedro", 47);
    this.trabajador = [
      new Empleado("Marta", 27),
      new Empleado("Marta", 27),
      new Empleado("Ana", 43),
      new Empleado("Alejandro", 38),
    ];
    this.trabajadorExterno = true;
  }
  ngOnInit() {
    console.log(this.empleadoExt)
  }
  cambiarExterno(valor:boolean){
    this.trabajadorExterno=valor;
  }
}
