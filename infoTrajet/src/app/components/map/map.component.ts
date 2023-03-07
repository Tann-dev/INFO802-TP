import { Component, AfterViewInit, Output, EventEmitter  } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  private map!: L.Map;

  private itineraire!: L.Routing.Control;

  private electricIcon = L.icon({
    iconUrl: 'assets/images/icons8-electric-power-64.png',
    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  private epingleIcon = L.icon({
    iconUrl: 'assets/images/icons8-epingle-de-carte-96.png',
    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  })

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 45.64046, 5.8714 ],
      zoom: 15
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    L.Marker.prototype.options.icon = this.epingleIcon
  }

  constructor() { }

  ngAfterViewInit(): void { 
    this.initMap();
  }

  parentEventHandlerFunction(trajet: any){
    // TODO mettre les bornes

    // Mettre une borne L.marker([45.64046, 5.8714], {icon: this.electricIcon}).addTo(this.map);

    if(this.itineraire != undefined)
      this.map.removeControl(this.itineraire);

    this.itineraire = L.Routing.control({
      waypoints: [
        L.latLng(trajet.depart.lat, trajet.depart.lon),
        L.latLng(trajet.arrivee.lat, trajet.arrivee.lon)
      ],
      show: false,
      fitSelectedRoutes: false,
    })

    this.itineraire.addTo(this.map)

    console.log(this.itineraire.getWaypoints())

    this.map.fitBounds([[
        trajet.depart.lat > trajet.arrivee.lat ? trajet.depart.lat : trajet.arrivee.lat, 
        trajet.depart.lon > trajet.arrivee.lon ? trajet.depart.lon : trajet.arrivee.lon
      ], [
        trajet.depart.lat < trajet.arrivee.lat ? trajet.depart.lat : trajet.arrivee.lat, 
        trajet.depart.lon < trajet.arrivee.lon ? trajet.depart.lon : trajet.arrivee.lon
      ]
    ])
  }
}
