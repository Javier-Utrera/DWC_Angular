import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentEmpleadoComponent } from './component-empleado/component-empleado.component';

@Component({
  selector: 'app-root',
  imports: [ComponentEmpleadoComponent],
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angApp_v19';
}
