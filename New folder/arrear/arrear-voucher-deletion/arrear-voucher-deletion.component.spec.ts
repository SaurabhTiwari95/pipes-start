import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearVoucherDeletionComponent } from './arrear-voucher-deletion.component';

describe('ArrearVoucherDeletionComponent', () => {
  let component: ArrearVoucherDeletionComponent;
  let fixture: ComponentFixture<ArrearVoucherDeletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrearVoucherDeletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrearVoucherDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
