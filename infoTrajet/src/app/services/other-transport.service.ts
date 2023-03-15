import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OtherTransportService {

  private apiURL = environment.apiRest;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getTime(typeTransport: String, distanceEnKm: number): Observable<any> {
    var request = {
      typeTransport: typeTransport,
      distanceEnKm: distanceEnKm
    }
    return this.httpClient.post<any>(this.apiURL + '/transport/', JSON.stringify(request), this.httpOptions)
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
