import { TestBed } from '@angular/core/testing';

import { RouterAuthGaurdService } from './router-auth-gaurd.service';

describe('RouterAuthGaurdService', () => {
  let service: RouterAuthGaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterAuthGaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
