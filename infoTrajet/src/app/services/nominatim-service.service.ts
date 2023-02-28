import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NominatimServiceService {

  private apiURL = "https://nominatim.openstreetmap.org/search?q=Chamb%C3%A9ry&country=France&format=json"

  constructor() { }
}
