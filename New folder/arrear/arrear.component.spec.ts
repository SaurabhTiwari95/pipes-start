import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearComponent } from './arrear.component';

describe('ArrearComponent', () => {
  let component: ArrearComponent;
  let fixture: ComponentFixture<ArrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
