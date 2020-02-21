import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearVoucherCreationComponent } from './arrear-voucher-creation.component';

describe('ArrearVoucherCreationComponent', () => {
  let component: ArrearVoucherCreationComponent;
  let fixture: ComponentFixture<ArrearVoucherCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrearVoucherCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrearVoucherCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
