import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BorneService {

  private apiURL = "https://odre.opendatasoft.com/api/records/1.0/search/?dataset=bornes-irve&rows=1&geofilter.distance=";

  httpOptions = {
    headers: new HttpHeaders({
      'Accept' : '*/*'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getBornes(lat:number, long:number, dist:number){
    return this.httpClient.get<any>(this.apiURL + lat + '%2C' + long + '%2C' + dist, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
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
