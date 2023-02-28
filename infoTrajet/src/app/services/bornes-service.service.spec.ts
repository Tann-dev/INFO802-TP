import { TestBed } from '@angular/core/testing';

import { BornesServiceService } from './bornes-service.service';

describe('BornesServiceService', () => {
  let service: BornesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BornesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
