import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  private urlBase = 'https://www.googleapis.com/books/v1/volumes';
  private claveAPI = 'AIzaSyDiDhPuc2l88zAkG8I-g_rFJjNSfxJ38Es'; // Sustituye con tu clave

  constructor(private http: HttpClient) {}

  buscarLibros(
    terminoBusqueda: string,
    idioma?: string,
    region?: string,
    intitle?: string,
    inauthor?: string
  ): Observable<any> {

    let url = `${this.urlBase}?q=${encodeURIComponent(terminoBusqueda)}&maxResults=10&orderBy=relevance&printType=books&projection=full`;
  
    if (intitle) {
      url += `&intitle:${encodeURIComponent(intitle)}`;
    }
  
    if (inauthor) {
      url += `&inauthor:${encodeURIComponent(inauthor)}`;
    }
  
    if (idioma) {
      url += `&langRestrict=${idioma}`;
    }
  
    if (region) {
      url += `&country=${region}`;
    }
  
    url += `&key=${this.claveAPI}`;
  
    console.log('URL enviada a Google Books:', url);
  
    return this.http.get(url);
  }
}
