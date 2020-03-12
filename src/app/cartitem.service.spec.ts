import { TestBed } from '@angular/core/testing';

import { CartitemService } from './cartitem.service';

describe('CartitemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartitemService = TestBed.get(CartitemService);
    expect(service).toBeTruthy();
  });
});
