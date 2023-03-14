import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtherTransportService {


  // TODO toutes les mettre en variable d'env
  private apiURL = "http://localhost:3000/api";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  create(typeTransport: String, distanceEnKm: number): Observable<any> {
    var request = {
      typeTransport: typeTransport,
      distanceEnKm: distanceEnKm
    }
    return this.httpClient.post<any>(this.apiURL + '/categories/', JSON.stringify(request), this.httpOptions)
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
