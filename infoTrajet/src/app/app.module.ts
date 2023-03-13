import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { FormMapComponent } from './components/form-map/form-map.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { APOLLO_NAMED_OPTIONS, ApolloModule, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    FormMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule, 
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    ApolloModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          chargetrip: {
            // <-- This settings will be saved by name: chargetrip
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'https://api.chargetrip.io/graphql',
              headers: new HttpHeaders({
                'x-client-id': '64005bb21952b9ff2c91465b',
                'x-app-id': '64005bb21952b9ff2c91465d'
              }),
              method: 'POST'
            }),
          },
        };
      },
      deps: [HttpLink],
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
