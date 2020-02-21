import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElVoucherDeletionComponent } from './el-voucher-deletion.component';

describe('ElVoucherDeletionComponent', () => {
  let component: ElVoucherDeletionComponent;
  let fixture: ComponentFixture<ElVoucherDeletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElVoucherDeletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElVoucherDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
