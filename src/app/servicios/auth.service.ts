import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth = inject(Auth);

  constructor() {}

  async iniciarSesion() {
      const provider = new GoogleAuthProvider();
      const credenciales = await signInWithPopup(this.auth, provider);
      console.log("✅ Usuario autenticado:", credenciales.user);
      return credenciales.user;
  }

  async cerrarSesion() {
    await signOut(this.auth);
    console.log("🚪 Sesión cerrada correctamente.");
  }


  obtenerUsuario(): Observable<any> {
    return user(this.auth);
  }
}
