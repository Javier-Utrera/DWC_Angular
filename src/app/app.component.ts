import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { ComponentEmpleadoComponent } from './component-empleado/component-empleado.component';
import { AlumnadoDAWComponentComponent } from './alumnado-dawcomponent/alumnado-dawcomponent.component';

@Component({
  selector: 'app-root',
  imports: [AlumnadoDAWComponentComponent],
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angApp_v19';
}
