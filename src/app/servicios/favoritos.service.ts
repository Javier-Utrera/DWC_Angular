import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, map, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private coleccionFavoritos = 'favoritos'; // 🔥 Nombre de la colección en Firestore

  constructor() {}

  /** ✅ Obtener los favoritos del usuario autenticado */
  obtenerFavoritos(): Observable<any[]> {
    return user(this.auth).pipe(
      switchMap((usuario) => {
        if (!usuario) return of([]); // 🔥 Si no hay usuario, devuelve un array vacío

        const favoritosRef = collection(this.firestore, this.coleccionFavoritos);
        const q = query(favoritosRef, where('userId', '==', usuario.uid));

        return getDocs(q).then(snapshot => {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
      })
    );
  }

  /** ⭐ Agregar un libro a favoritos */
  async agregarFavorito(libro: any) {
    const usuario = this.auth.currentUser;
    if (!usuario) throw new Error('No hay usuario autenticado.');
  
    const favoritosRef = collection(this.firestore, this.coleccionFavoritos);
    return addDoc(favoritosRef, {
      userId: usuario.uid,
      libroId: libro.id,
      titulo: libro.volumeInfo.title || 'Sin título',
      autor: libro.volumeInfo.authors ? libro.volumeInfo.authors.join(', ') : 'Desconocido',
      portada: libro.volumeInfo.imageLinks?.thumbnail || ''
    });
  }
  

  /** ❌ Eliminar un libro de favoritos */
  async eliminarFavorito(idFavorito: string) {
    const favoritoRef = doc(this.firestore, `${this.coleccionFavoritos}/${idFavorito}`);
    return deleteDoc(favoritoRef);
  }
}
