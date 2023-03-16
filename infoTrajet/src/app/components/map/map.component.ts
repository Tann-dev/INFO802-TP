import { Component, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef, Renderer2  } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { BorneService } from 'src/app/services/borne.service';
import { lastValueFrom } from 'rxjs';
import { CalculTrajetService } from 'src/app/services/calcul-trajet.service';
import { OtherTransportService } from 'src/app/services/other-transport.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  private map!: L.Map;
  // 15KM
  private distanceABorneEnM: number = 15000;
  private itineraire!: L.Routing.Control;
  private waypoints: any[] = [];
  private voiture!: any;
  public tempsMinutes!: number;
  public tempsMinutesOther!: number;
  private distanceTotale!: number;
  @ViewChild('map') mapElement: ElementRef<HTMLDivElement> | undefined;

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

  constructor(public borneService: BorneService,
    public trajetService: CalculTrajetService,
    public otherTransportService: OtherTransportService,
    private renderer : Renderer2) { }

  ngAfterViewInit(): void { 
    this.initMap();
  }

  async trajetHandler(trajet: any){
    this.map.fitBounds([[
      trajet.depart.lat > trajet.arrivee.lat ? trajet.depart.lat : trajet.arrivee.lat, 
      trajet.depart.lon > trajet.arrivee.lon ? trajet.depart.lon : trajet.arrivee.lon
    ], [
      trajet.depart.lat < trajet.arrivee.lat ? trajet.depart.lat : trajet.arrivee.lat, 
      trajet.depart.lon < trajet.arrivee.lon ? trajet.depart.lon : trajet.arrivee.lon
    ]
  ])

    this.voiture = trajet.voiture;

    if(this.itineraire != undefined) {
      this.map.removeControl(this.itineraire);
    }

    this.waypoints = [];

    this.itineraire = L.Routing.control({
      waypoints: [
        L.latLng(trajet.depart.lat, trajet.depart.lon),
        L.latLng(trajet.arrivee.lat, trajet.arrivee.lon)
      ],
      show: false,
      fitSelectedRoutes: false,
      addWaypoints: false
    })

    this.itineraire.addTo(this.map)

    this.findWaypoints().then((result: any) => {
      this.waypoints.push(L.latLng(trajet.depart.lat, trajet.depart.lon))
      result.forEach((ele: { lat: number; lng: number; }) => {
        this.waypoints.push(L.latLng(ele.lat, ele.lng))
      });
      this.waypoints.push(L.latLng(trajet.arrivee.lat, trajet.arrivee.lon))

      this.itineraire.setWaypoints(this.waypoints)

      var childs = this.mapElement?.nativeElement.childNodes[0].childNodes[3].childNodes;
      if(childs != undefined && childs.length > 2){
        for( var i = 1; i< childs.length -1; i++){
          this.renderer.setStyle(childs[i], "content", 'url("assets/images/icons8-electric-power-64.png")');
        } 
      }

      this.calculTempsTrajet(this.distanceTotale/1000, this.voiture.routing.fast_charging_support, this.waypoints.length - 2, trajet.otherTypeTrasport)
    })
    
  }

  async findWaypoints() {
    return new Promise(async (resolve) => {
      this.itineraire.on("routesfound", async (e) => {
        var bornes = []
        this.distanceTotale = e.routes[0].summary.totalDistance
        var distanceEntrePoints = this.distanceTotale / e.routes[0].coordinates.length
        var nbPointsEntreDistanceABorneEnM = Math.floor(this.distanceABorneEnM / distanceEntrePoints)
        var autonomieEnM = (this.voiture.range.chargetrip_range.worst) * 1000 - this.distanceABorneEnM
        if(this.distanceTotale > autonomieEnM) {
          var nbPointsEntreBornes = Math.floor(autonomieEnM / distanceEntrePoints)
          for (let i = nbPointsEntreBornes; i < e.routes[0].coordinates.length; i += nbPointsEntreBornes) {
            if(i < e.routes[0].coordinates.length) {
              let currentBorne = null
              while(currentBorne == null) {
                currentBorne = await lastValueFrom(this.borneService.getBornes(e.routes[0].coordinates[i].lat, e.routes[0].coordinates[i].lng, this.distanceABorneEnM))
                if(currentBorne.records.length == 0) {
                  currentBorne = null;
                  i -= nbPointsEntreDistanceABorneEnM;
                }
              }
              bornes.push({
                lat: currentBorne.records[0].geometry.coordinates[1],
                lng: currentBorne.records[0].geometry.coordinates[0]
              });
            }
          }
        }
        resolve(bornes);
      })
    });
  }

  calculTempsTrajet(distanceEnKm: number, isFastCharging: boolean, nbBornes: number, typeTransport: String) {
    this.trajetService.tempsTrajet(distanceEnKm, isFastCharging, nbBornes).subscribe((data: any) =>{
      this.tempsMinutes = Math.floor(data) + 1;
    })

    if(typeTransport != "null" && typeTransport != undefined) {
      this.otherTransportService.getTime(typeTransport, distanceEnKm).subscribe((data: any) => {
        this.tempsMinutesOther = Math.floor(data.tempsTrajetMinute) + 1;
      })
    }
  }
}
