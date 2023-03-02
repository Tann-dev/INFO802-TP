import { Injectable } from '@angular/core';
import { Apollo, ApolloBase, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {

  private apollo: ApolloBase;
 
  constructor(private apolloProvider: Apollo) {
    this.apollo = this.apolloProvider.use('chargetrip');
  }
 
  test(): void {
    this.apollo.watchQuery({
      query: gql`
          {
            vehicleList(
              page: 10, 
              size: 10, 
              search: ""
            ) {
              id
              naming {
                make
                model
                chargetrip_version
              }
              media {
                image {
                  thumbnail_url
                }
              }
            }
          }
        `,
    }).valueChanges.subscribe((result: any) => {
      console.log(result)
    });
  }

}
