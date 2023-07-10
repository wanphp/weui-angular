import { TestBed } from '@angular/core/testing';

import { WxService } from './wx.service';

describe('WxService', () => {
  let service: WxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
