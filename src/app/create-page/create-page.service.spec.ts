import { TestBed } from '@angular/core/testing';

import { CreatePageService } from './create-page.service';

describe('CreatePageService', () => {
  let service: CreatePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
