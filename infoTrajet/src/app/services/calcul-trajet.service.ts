import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
    
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalculTrajetService {

  private apiURL = "http://localhost:8000";
  private parser = new DOMParser();

  httpOptions = {
    headers: new HttpHeaders({
      'Accept' : '*/*'
    }),
    responseType: 'text' as 'json'
  }

  constructor(private httpClient: HttpClient) { }

  trajet(distanceEnKm: number, vMoyKmH: number, tempsArretMin: number, autonomieEnKm: number): Observable<any> {
    var body : String = 
    "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:spy=\"spyne.examples.trajet.soap\"> \
      <soapenv:Header/> \
      <soapenv:Body> \
         <spy:tempsTrajet> \
            <!--Optional:--> \
            <spy:distanceEnKm>" + distanceEnKm+ "</spy:distanceEnKm> \
            <!--Optional:--> \
            <spy:vMoyKmH>" + vMoyKmH + "</spy:vMoyKmH> \
            <!--Optional:--> \
            <spy:tempsArretMin>" + tempsArretMin + "</spy:tempsArretMin> \
            <!--Optional:--> \
            <spy:autonomieEnKm>" + autonomieEnKm + "</spy:autonomieEnKm> \
         </spy:tempsTrajet> \
      </soapenv:Body> \
   </soapenv:Envelope>" 
    return this.httpClient.post<any>(this.apiURL, body, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 

  tempsTrajet(distanceEnKm: number, vMoyKmH: number, tempsArretMin: number, autonomieEnKm: number) : Observable<number> {
    var subject = new Subject<number>();
    this.trajet(distanceEnKm, vMoyKmH, tempsArretMin, autonomieEnKm).subscribe((data: any) =>{
        let xmlDoc = this.parser.parseFromString(data,"text/xml");
        subject.next(xmlDoc.getElementsByTagName("tns:tempsTrajetResult")[0].childNodes[0].nodeValue as unknown as number); 
      }
    )
    return subject.asObservable();
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
