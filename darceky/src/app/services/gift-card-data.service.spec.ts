import { TestBed } from '@angular/core/testing';

import { GiftCardDataService } from './gift-card-data.service';

describe('GiftCardDataService', () => {
  let service: GiftCardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiftCardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
