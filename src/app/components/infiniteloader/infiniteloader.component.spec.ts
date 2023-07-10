import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteloaderComponent } from './infiniteloader.component';

describe('InfiniteloaderComponent', () => {
  let component: InfiniteloaderComponent;
  let fixture: ComponentFixture<InfiniteloaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfiniteloaderComponent]
    });
    fixture = TestBed.createComponent(InfiniteloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
