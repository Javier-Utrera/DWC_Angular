import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  // meto la dependencia Firestore que tengo instalado en node_modules, este se encarga de manejar la base de datos en sus servidores
  firestore: Firestore = inject(Firestore);
  // este es el nombre de la coleccion que tengo en firebase, ahi es donde hago un insert de mis libros favoritos
  //  autor""(cadena)
  //  libroId""(cadena)
  //  portada""(cadena)
  //  titulo""(cadena)
  //  userId""(cadena)
  // esto son los valores que almaceno en cada registro
  coleccionFavoritos = 'favoritos';
  // injecto el servicio AuthService de mi arhicvo auth.service.ts (se encarga de autenticar con google)
  constructor(private authService: AuthService) {}

  // con este metodo obtengo la coleccion de favoritos del usuario autenticado
  obtenerFavoritos(): Observable<any[]> {
    return new Observable((observer) => {
      this.authService.obtenerUsuario().subscribe((usuario) => {
        //si el usuario que me devuelve es null, osea que notengo usuario autenticado me devuelve un array vacio y me salgo del metodo obtenerFavorito
        if (!usuario) {
          observer.next([]);
          observer.complete();
          return;
        }
        // si llego aqui es que tengo usuario autenticado, llamo al metodo con el uid (id de firebase) , me devuelve los datos y los envio a favoritos
        this.consultarFavoritos(usuario.uid).then((favoritos) => {
          observer.next(favoritos);
          observer.complete();
        }).catch((error) => {
          console.error("Error obteniendo favoritos:", error);
          observer.error(error);
        });
      });
    });
  }

  // con este metodo vamos a consultar la base de datos de fire usando el uid, este metodo siempre va devolver un array, ya sea vacio o con datos
  async consultarFavoritos(uid: string): Promise<any[]> {
    const favoritosRef = collection(this.firestore, this.coleccionFavoritos);
    // esta es nuestra consulta como si la tiraramos en mysql
    const q = query(favoritosRef, where('userId', '==', uid));
    // el getDocs es el metodo que usa firebase para mandar la consulta que hemos creado, firebase dentro de una coleccion almacena muchos documentos,
    // uno por cada insert, y cada insert tiene los registros
    const snapshot = await getDocs(q);
    // snapshot ahora tiene un array con los documentos que hemos encontrado en la base de datos, y usamos la funcion de arrays map, para devolver un json bien estructurado,
    // siendo el primer valor de cada bloque de registro el id del documento
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // para agregar a los favoritos de un usario autenticado en la base de datos, necesitamos un libro, y el id del usuario
  async agregarFavorito(libro: any) {
    // detengo el codigo con el await y transformo el observable de obtenerUsuario en una promesa, como solo quiero el primer valor que me mande que va ser el usuario, hago que el codigo
    // siga ejecutandose justo despues de obtenerlo, es una manera mas rapida de usar el observable en vez de hacer el subscribe
    const usuario = await firstValueFrom(this.authService.obtenerUsuario());
    if (!usuario) throw new Error('No hay usuario autenticado.');
    // firebase alamacena los documentos de favoritos en una coleccion, asi que obtener esa coleccion
    const favoritosRef = collection(this.firestore, this.coleccionFavoritos);
    console.log("Agregando libro a favoritos:", libro);
    // aqui añadimos el documento a fire usando el id del usuario autenticado y los valores del libro que le hemos pasado al metodo
    return addDoc(favoritosRef, {
      userId: usuario.uid,
      libroId: libro.id,
      titulo: libro.volumeInfo.title || 'Sin título',
      autor: libro.volumeInfo.authors ? libro.volumeInfo.authors.join(', ') : 'Desconocido',
      portada: libro.volumeInfo.imageLinks?.thumbnail || ''
    });
  }

  async eliminarFavorito(idFavorito: string) {
    const favoritoRef = doc(this.firestore, `${this.coleccionFavoritos}/${idFavorito}`);
    return deleteDoc(favoritoRef);
  }
}
