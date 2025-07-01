import { TestBed } from '@angular/core/testing';

import { MaininventoryService } from './maininventory.service';

describe('MaininventoryService', () => {
  let service: MaininventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaininventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
