import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private urlBase = 'https://www.googleapis.com/books/v1/volumes';
  private key = "AIzaSyCf8kbjRcJzD0qq-ibztYOsK3bxJes0xMc";
  constructor(private http: HttpClient) {}
  //este es mi metodo principal para buscar los libros en mi api, he hecho que todos los atributos sean opciones menos los resultados 
  // que me devuelve en cada peticion y en la pagina que empiza mis resultados
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
    // aqui creo mi consulta principal que tiene la api, que se mandan o no concatenandolos con un '+'
    let queryParts: string[] = [];
    // si o si la consulta tiene que tener almenos uno de estos parametros, uso el trim() para que me quite los espacios
    if (terminoBusqueda?.trim()) queryParts.push(terminoBusqueda.trim());
    if (intitle?.trim()) queryParts.push(`intitle:${intitle.trim()}`);
    if (inauthor?.trim()) queryParts.push(`inauthor:${inauthor.trim()}`);
    if (subject?.trim()) queryParts.push(`subject:${subject.trim()}`);
    // valido que almenos hemos introducido un parametro en la busqueda, ya que si no mandamos ninguna la api de google nos devolvera un error
    if (queryParts.length === 0) {
      return throwError(() => new Error('No se puede hacer la búsqueda sin parámetros válidos.'));
    }
    // aqui uno todos los strings que he metido en queryParts con '+'
    let query = queryParts.join('+');

    // aqui construyo la peticion que va hacer a la api, estos parametros se van a enviar siempre
    let params = new HttpParams()
      .set('q', query)
      .set('maxResults', maxResults.toString())
      .set('startIndex', startIndex.toString())
      // la api de google ademas de libros contiene revistas y tesis, voy a enfocar mi pagina solo en libros
      .set('printType', 'books')
      // esta key la he generado en mi servicio de google, ahi me cree mi usuario y lo configure, no es necesaria para hacer consultas a la api, pero si la uso,
      // veo en tiempo real en las estadisticas de google las peticiones que hago, la demora que tienen y los posibles errores que me devuelva google
      .set('key', this.key); 

    // estos parametros son opcionales, cuando uso el componente resultados y hago el susbcribe a este observable, le paso los parametros si los necesito
    if (idioma) params = params.set('langRestrict', idioma);
    if (region) params = params.set('country', region);
    if (orderBy) params = params.set('orderBy', orderBy);

    console.log('URL de la API:', `${this.urlBase}?${params.toString()}`);
    // y aqui realizo la peticion
    return this.http.get<any>(this.urlBase, { params });
  }

}