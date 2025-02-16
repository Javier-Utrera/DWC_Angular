import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private urlBase = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  buscarLibros(
    terminoBusqueda?: string,
    maxResults: number = 20,
    startIndex: number = 0,
    orderBy?: string,
    idioma?: string,
    region?: string,
    intitle?: string,
    inauthor?: string,
    subject?: string
  ): Observable<any> {
    let queryParts: string[] = [];

    if (terminoBusqueda?.trim()) queryParts.push(terminoBusqueda.trim());
    if (intitle?.trim()) queryParts.push(`intitle:${intitle.trim()}`);
    if (inauthor?.trim()) queryParts.push(`inauthor:${inauthor.trim()}`);
    if (subject?.trim()) queryParts.push(`subject:${subject.trim()}`);

    if (queryParts.length === 0) {
      return throwError(() => new Error(' No se puede hacer la búsqueda sin parámetros válidos.'));
    }

    let query = queryParts.join('+');

    let params = new HttpParams()
      .set('q', query)
      .set('maxResults', maxResults.toString())
      .set('startIndex', startIndex.toString())
      .set('printType', 'books')

    if (idioma) params = params.set('langRestrict', idioma);
    if (region) params = params.set('country', region);
    if (orderBy) params = params.set('orderBy', orderBy);

    console.log('URL de la API:', `${this.urlBase}?${params.toString()}`);

    return this.http.get<any>(this.urlBase, { params });
  }
}
