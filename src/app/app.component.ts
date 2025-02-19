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
  usuario: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
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
