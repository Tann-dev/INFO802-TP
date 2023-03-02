import { Component, OnInit} from '@angular/core';
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
  tempsMinutes: number | null = null;
  places: any[] = [];

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
      arrivee: ["", [Validators.required]]
    })

    this.formTrajet = this.formBuilder.group( {
      distanceEnKm: [0, [Validators.required]],
      vMoyKmH: [0, [Validators.required]],
      tempsArretMin: [0, [Validators.required]],
      autonomieEnKm: [0, [Validators.required]]
    })

    this.voitureService.test();
  }

  getDepart() {
    this.nominatimService.coordonnees(this.formDestination.controls['depart'].value).subscribe((data: any[]) => {
      this.places = data
    })
  }

  calculate() {
    this.trajetService.tempsTrajet(
      this.formTrajet.controls['distanceEnKm'].value,
      this.formTrajet.controls['vMoyKmH'].value,
      this.formTrajet.controls['tempsArretMin'].value,
      this.formTrajet.controls['autonomieEnKm'].value
      ).subscribe((data: any) =>{
      this.tempsMinutes = data;
      console.log(this.formDestination.controls['valueDepart'].value);
    })
  }
}
