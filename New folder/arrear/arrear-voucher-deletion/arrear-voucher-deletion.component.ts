import { Component, OnInit } from '@angular/core';
import { ArrearServiceService } from '../arrear-service.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
// import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-arrear-voucher-deletion',
  templateUrl: './arrear-voucher-deletion.component.html',
  styleUrls: ['./arrear-voucher-deletion.component.scss']
})
export class ArrearVoucherDeletionComponent implements OnInit {

  constructor(
    public service : ArrearServiceService,
    public serverService: GetDataFromApiService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService,
    public smartModal: NgxSmartModalService

  ) { }

  indexOfVoucher;
  empObj = {
    voucherDetails: {
      employeeArray: []
    }
  };

  filteredData = [];

  closeModal() {
    this.smartModal.getModal("voucherDetails").close();
  }

  closeAllVoucherDetails() {
    this.smartModal.getModal("voucherEmpDetails").close();
  }
  voucherDetailModalObj = {
    arrayOfvoucherDetailsOfVoucherType: [],
    voucherNumber: null,
    voucherDate: null
  };

  viewVoucherDetails(_Index) {
    this.indexOfVoucher = _Index;
    this.empObj.voucherDetails = {
      ...this.service.voucherDeletionDetails.voucherDetails[_Index]
    };
    this.filteredData = [
      ...this.service.voucherDeletionDetails.voucherDetails[_Index]
        .employeeArray
    ];
    this.smartModal.getModal("voucherEmpDetails").open();
  }

  searchEmpDetailInVoucherDel(event) {
    this.filteredData = event.target.value
      ? this.service.voucherDeletionDetails.voucherDetails[
        this.indexOfVoucher
      ].employeeArray.filter(elem => {
        if (
          elem.employeeName
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
          elem.employeeId
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
          elem.divisionName
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
          ("" + elem.payDays)
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
          ("" + elem.arrearAmount)
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
            ("" + elem.arrearYear)
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
            ("" + elem.previousGross)
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
            ("" + elem.arrearMonth)
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 || 
            ("" + elem.currentGross)
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
            ("" + elem.workDays)
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
          elem.departmentName
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1
        ) {
          return true;
        } else {
          return false;
        }
      })
      : this.service.voucherDeletionDetails.voucherDetails[this.indexOfVoucher]
        .employeeArray;
  }

  ngOnInit() {
  }

}
