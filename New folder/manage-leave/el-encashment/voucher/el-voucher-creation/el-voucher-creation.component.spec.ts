import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ElVoucherCreationComponent } from "./el-voucher-creation.component";

describe("ElVoucherCreationComponent", () => {
  let component: ElVoucherCreationComponent;
  let fixture: ComponentFixture<ElVoucherCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ElVoucherCreationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElVoucherCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
