import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//Con este servicio puedo autenticarme con google en firebase
export class AuthService {
  auth: Auth = inject(Auth);

  constructor() {}

  async iniciarSesion() {
    //creo la instancia del proveedor de autenticacion de google
      const provider = new GoogleAuthProvider();
    //abro una nueva ventana para poder seleccionar una cuenta de google
      const credenciales = await signInWithPopup(this.auth, provider);
      console.log("Usuario autenticado: ", credenciales.user);
      return credenciales.user;
  }

  async cerrarSesion() {
    await signOut(this.auth);
    console.log("Sesion cerrada correctamente");
  }

// Este metodo para crear un observable y saber si actualmente en mi proyecto tengo un usuario autenticado, este metodo es un observable porque lo
// voy a usar en app.componente.ts  con un subscribe, como no se el tiempo que va tardar en recibir la respuesta de ahi el observable
  obtenerUsuario(): Observable<any> {
    return user(this.auth);
  }
}
