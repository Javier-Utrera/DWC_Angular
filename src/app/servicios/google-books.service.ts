import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private urlBase = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  buscarLibros(
    terminoBusqueda: string,
    maxResults: number,
    startIndex: number,
    idioma?: string,
    region?: string,
    intitle?: string,
    inauthor?: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('q', encodeURIComponent(terminoBusqueda))
      .set('maxResults', maxResults.toString())
      .set('startIndex', startIndex.toString())

    if (intitle) params = params.append('q', `intitle:${encodeURIComponent(intitle)}`);
    if (inauthor) params = params.append('q', `inauthor:${encodeURIComponent(inauthor)}`);
    if (idioma) params = params.set('langRestrict', idioma);
    if (region) params = params.set('country', region);

    console.log('📚 URL de la API:', `${this.urlBase}?${params.toString()}`);

    return this.http.get<any>(this.urlBase, { params }).pipe(
      catchError(error => {
        console.error('❌ Error en la búsqueda de libros:', error);
        return throwError(() => new Error('Error al buscar libros en la API de Google Books'));
      })
    );
  }
}
