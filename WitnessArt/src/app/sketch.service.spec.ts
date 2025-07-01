import { TestBed } from '@angular/core/testing';

import { SketchService } from './facesketch/sketch.service';

describe('SketchService', () => {
  let service: SketchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SketchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
