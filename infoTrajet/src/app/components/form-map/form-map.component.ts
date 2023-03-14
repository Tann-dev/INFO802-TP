import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NominatimService } from 'src/app/services/nominatim.service';
import { VoitureService } from 'src/app/services/voiture.service';

@Component({
  selector: 'app-form-map',
  templateUrl: './form-map.component.html',
  styleUrls: ['./form-map.component.scss']
})
export class FormMapComponent implements OnInit {

  @Input() tempsMinutesOtherParent: any;
  @Input() tempsMinutesParent: any;
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
      voiture: ["", [Validators.required]],
      otherTypeTrasport: ["null", [Validators.required]]
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

  tracer() {
    var trajet = {
      depart: this.formDestination.controls['valueDepart'].value,
      arrivee: this.formDestination.controls['valueArrivee'].value,
      voiture: this.formDestination.controls['voiture'].value,
      otherTypeTrasport: this.formDestination.controls['otherTypeTrasport'].value
    }
    this.buttonClicked.emit(trajet);
  }

  getVoitures() {
    this.voitureService.findVehicule(this.formDestination.controls['nom'].value).subscribe(data =>  {
      this.voitureList = data.data.vehicleList
    });
  }
}
