import { TestBed } from '@angular/core/testing';

import { SharedUtilitiesService } from './shared-utilities.service';

describe('SharedUtilitiesService', () => {
  let service: SharedUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
