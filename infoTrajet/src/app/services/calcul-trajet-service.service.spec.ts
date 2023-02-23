import { TestBed } from '@angular/core/testing';

import { CalculTrajetServiceService } from './calcul-trajet-service.service';

describe('CalculTrajetServiceService', () => {
  let service: CalculTrajetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculTrajetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
