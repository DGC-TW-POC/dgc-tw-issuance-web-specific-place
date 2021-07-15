import { TestBed } from '@angular/core/testing';

import { NHICardService } from './nhicard.service';

describe('NHICardService', () => {
  let service: NHICardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NHICardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
