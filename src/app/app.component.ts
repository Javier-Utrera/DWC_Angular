import { Component, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  usuario: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.obtenerUsuario().subscribe(user => {
      this.usuario = user;
    });
  }

  /** 🔥 Iniciar sesión con Firebase */
  async iniciarSesion() {
    await this.authService.iniciarSesion();
  }

  /** 🚪 Cerrar sesión en Firebase */
  async cerrarSesion() {
    await this.authService.cerrarSesion();
  }
}
