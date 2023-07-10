import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToptipsComponent } from './toptips.component';

describe('ToptipsComponent', () => {
  let component: ToptipsComponent;
  let fixture: ComponentFixture<ToptipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToptipsComponent]
    });
    fixture = TestBed.createComponent(ToptipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
