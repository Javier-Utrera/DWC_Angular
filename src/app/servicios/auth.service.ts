import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor() {}

  /** 🔥 Iniciar sesión con Google */
  async iniciarSesion() {
    try {
      const provider = new GoogleAuthProvider();
      const credenciales = await signInWithPopup(this.auth, provider);
      console.log("✅ Usuario autenticado:", credenciales.user);
      return credenciales.user;
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      throw error;
    }
  }

  /** 🚪 Cerrar sesión */
  async cerrarSesion() {
    await signOut(this.auth);
    console.log("🚪 Sesión cerrada correctamente.");
  }

  /** 🔍 Obtener el usuario autenticado */
  obtenerUsuario(): Observable<any> {
    return user(this.auth);
  }
}
