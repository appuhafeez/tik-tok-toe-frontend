import { TestBed } from '@angular/core/testing';

import { GameBackendService } from './game-backend.service';

describe('GameBackendService', () => {
  let service: GameBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
