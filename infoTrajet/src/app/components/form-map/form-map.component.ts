import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculTrajetService } from 'src/app/services/calcul-trajet.service';
import { NominatimService } from 'src/app/services/nominatim.service';
import { VoitureService } from 'src/app/services/voiture.service';

@Component({
  selector: 'app-form-map',
  templateUrl: './form-map.component.html',
  styleUrls: ['./form-map.component.scss']
})
export class FormMapComponent implements OnInit {

  formDestination: FormGroup = new FormGroup({});
  formTrajet: FormGroup = new FormGroup({});
  formVoiture: FormGroup = new FormGroup({});
  tempsMinutes: number | null = null;
  placesDepart: any[] = [{display_name: "Rien"}];
  placesArrivee: any[] = [{display_name: "Rien"}];
  voitureList: any[] = [{naming: {
            make: "Rien",
            model: "",
            version: "",
            edition: ""
        }
      }];

  @Output() buttonClicked = new EventEmitter<any>();

  constructor(
    public trajetService: CalculTrajetService,
    private formBuilder: FormBuilder,
    public voitureService: VoitureService,
    public nominatimService: NominatimService
  ) { }

  ngOnInit() {
    this.formDestination = this.formBuilder.group( {
      depart: ["", [Validators.required]],
      valueDepart: ["", [Validators.required]],
      arrivee: ["", [Validators.required]],
      valueArrivee: ["", [Validators.required]],
      nom: ["", [Validators.required]],
      voiture: ["", [Validators.required]]
    })
  }

  getDepart() {
    this.nominatimService.coordonnees(this.formDestination.controls['depart'].value).subscribe((data: any[]) => {
      this.placesDepart = data
    })
  }

  getArrivee() {
    this.nominatimService.coordonnees(this.formDestination.controls['arrivee'].value).subscribe((data: any[]) => {
      this.placesArrivee = data
    })
  }

  /*calculate() {
    this.trajetService.tempsTrajet(
      this.formTrajet.controls['distanceEnKm'].value,
      this.formTrajet.controls['vMoyKmH'].value,
      this.formTrajet.controls['tempsArretMin'].value,
      this.formTrajet.controls['autonomieEnKm'].value
      ).subscribe((data: any) =>{
      this.tempsMinutes = data;
    })
  }*/

  tracer() {
    var trajet = {
      depart: this.formDestination.controls['valueDepart'].value,
      arrivee: this.formDestination.controls['valueArrivee'].value,
      voiture: this.formDestination.controls['voiture'].value
    }
    this.buttonClicked.emit(trajet);
  }

  getVoitures() {
    this.voitureService.findVehicule(this.formDestination.controls['nom'].value).subscribe(data =>  {
      this.voitureList = data.data.vehicleList
    });
  }
}
