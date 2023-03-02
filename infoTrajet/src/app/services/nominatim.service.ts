import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  private apiURL = "https://nominatim.openstreetmap.org/search?format=json&q="

  httpOptions = {
    headers: new HttpHeaders({
      'Accept' : '*/*'
    })
  }

  constructor(private httpClient: HttpClient) { }

  coordonnees(ville: String): any {
    return this.httpClient.post<any>(this.apiURL + ville, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}
