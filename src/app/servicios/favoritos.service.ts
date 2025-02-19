import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  firestore: Firestore = inject(Firestore);
  coleccionFavoritos = 'favoritos';

  constructor(private authService: AuthService) {}


  obtenerFavoritos(): Observable<any[]> {
    return new Observable((observer) => {
      this.authService.obtenerUsuario().subscribe((usuario) => {
        if (!usuario) {
          observer.next([]);
          observer.complete();
          return;
        }

        this.consultarFavoritos(usuario.uid).then((favoritos) => {
          observer.next(favoritos);
          observer.complete();
        }).catch((error) => {
          console.error("❌ Error obteniendo favoritos:", error);
          observer.error(error);
        });
      });
    });
  }


  async consultarFavoritos(uid: string): Promise<any[]> {
    const favoritosRef = collection(this.firestore, this.coleccionFavoritos);
    const q = query(favoritosRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }


  async agregarFavorito(libro: any) {
    const usuario = await firstValueFrom(this.authService.obtenerUsuario());
    if (!usuario) throw new Error('No hay usuario autenticado.');
  
    const favoritosRef = collection(this.firestore, this.coleccionFavoritos);
    console.log("📌 Agregando libro a favoritos:", libro);
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
