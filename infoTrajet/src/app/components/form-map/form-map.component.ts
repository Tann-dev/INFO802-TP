import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculTrajetServiceService } from 'src/app/services/calcul-trajet-service.service';

@Component({
  selector: 'app-form-map',
  templateUrl: './form-map.component.html',
  styleUrls: ['./form-map.component.scss']
})
export class FormMapComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({});

  tempsMinutes: number | null = null;

  constructor(
    public trajetService: CalculTrajetServiceService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group( {
      distanceEnKm: [0, [Validators.required]],
      vMoyKmH: [0, [Validators.required]],
      tempsArretMin: [0, [Validators.required]],
      autonomieEnKm: [0, [Validators.required]]
    })
  }

  calculate() {
    this.trajetService.tempsTrajet(
      this.formGroup.controls['distanceEnKm'].value,
      this.formGroup.controls['vMoyKmH'].value,
      this.formGroup.controls['tempsArretMin'].value,
      this.formGroup.controls['autonomieEnKm'].value
      ).subscribe((data: any) =>{
      this.tempsMinutes = data;
    })
  }
}
