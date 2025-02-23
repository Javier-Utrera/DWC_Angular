import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  //Aqui almaceno mi usuario autenticado
  usuario: any = null;
  // instancio AuthService en la variable authService para poder usar sus funciones
  constructor(public authService: AuthService) {}
  // ngOnInit se actiavara automaticamente cuando el componente se inicialice
  ngOnInit(): void {
    // cuando el componente se inicialice y hay un usuario autenticado guardara la informacion en usuario, pero si no hay usuario, la variable 'usuario'
    // sera null
    this.authService.obtenerUsuario().subscribe(user => {
      this.usuario = user;
    });
  }

  async iniciarSesion() {
    await this.authService.iniciarSesion();
  }

  async cerrarSesion() {
    await this.authService.cerrarSesion();
  }
}
