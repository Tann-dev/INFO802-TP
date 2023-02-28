import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BornesServiceService {

  private apiURL = "https://odre.opendatasoft.com/api/v2/";

  httpOptions = {
    headers: new HttpHeaders({
      'Accept' : '*/*'
    })
  }

  constructor(private httpClient: HttpClient) { }

  trajet(distanceEnKm: number, vMoyKmH: number, tempsArretMin: number, autonomieEnKm: number): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + "/catalog", this.httpOptions)
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
