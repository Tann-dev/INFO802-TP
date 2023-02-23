import { Component } from '@angular/core';
import { CalculTrajetServiceService } from 'src/app/services/calcul-trajet-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public trajetService: CalculTrajetServiceService) { }

  ngOnInit(){
    this.trajetService.tempsTrajet(280, 80, 7, 100).subscribe(data =>{
      console.log(data)
    })
  }

}
