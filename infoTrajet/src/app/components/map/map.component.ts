import { Component, AfterViewInit  } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  private map!: L.Map;

  private electricIcon = L.icon({
    iconUrl: 'assets/images/icons8-electric-power-64.png',
    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

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

    var electricIcon = L.icon({
      iconUrl: 'assets/images/icons8-electric-power-64.png',
      iconSize:     [40, 40], // size of the icon
      iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([45.64046, 5.8714], {icon: electricIcon}).addTo(this.map);

    L.Marker.prototype.options.icon = electricIcon

    L.Routing.control({
      waypoints: [
        L.latLng(57.74, 11.94),
        L.latLng(57.6792, 11.949)
      ],
      show: false,
      fitSelectedRoutes: false,
    }).addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void { 
    this.initMap();
  }
}
