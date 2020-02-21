import { Component, OnInit } from '@angular/core';
import { ArrearServiceService } from '../arrear-service.service';

@Component({
  selector: 'app-arrear-voucher-creation',
  templateUrl: './arrear-voucher-creation.component.html',
  styleUrls: ['./arrear-voucher-creation.component.scss']
})
export class ArrearVoucherCreationComponent implements OnInit {

  constructor(
    public service : ArrearServiceService
  ) { }
  noEmpSelectedForVoucherCreation = false;

  checkUncheckAll = () => {
    this.service.totalSlctdEmp = 0;
    this.service.voucherTotalDetails.totalVoucherAmount = 0;
    if (this.service.isAllEmpSlctdInVoucherCreation == true) {
      for (let emp of this.service.empVoucherDetailsToSearch) {
        emp.isSelected = true;
        this.service.voucherTotalDetails.totalVoucherAmount =
          this.service.voucherTotalDetails.totalVoucherAmount +
          emp.encashedAmount;
      }
      this.service.totalSlctdEmp = this.service.empVoucherDetailsToSearch.length;
    } else {
      for (let emp of this.service.empVoucherDetailsToSearch) {
        emp.isSelected = false;
      }
      this.service.totalSlctdEmp = 0;
      this.service.voucherTotalDetails.totalVoucherAmount = 0;
    }
    this._SetDataAccordinglly();
  };

  _SetDataAccordinglly = () => {
    this.noEmpSelectedForVoucherCreation =
      this.service.totalSlctdEmp == 0 ? true : false;
    for (var i of this.service.leaveDetailsPendingForVoucher
      .employeeVoucherDetails) {
      for (var j of this.service.empVoucherDetailsToSearch) {
        if (j.employeeId == i.employeeId) {
          i.isSelected = j.isSelected;
        }
      }
    }
  };

  // //  count = 0;
  checkIfEmpSlctd = _Row => {
    if (_Row.isSelected == false) {
      this.service.isAllEmpSlctdInVoucherCreation = false;
      this.service.totalSlctdEmp--;
      this.service.voucherTotalDetails.totalVoucherAmount =
        this.service.voucherTotalDetails.totalVoucherAmount -
        _Row.encashedAmount;
    } else {
      //  for (let emp of this.service.employeeLeaveVoucherCreation) {

      if (_Row.isSelected == true) {
        this.service.totalSlctdEmp++;
        this.service.voucherTotalDetails.totalVoucherAmount =
          this.service.voucherTotalDetails.totalVoucherAmount +
          _Row.encashedAmount;
      }
      // }
      if (
        this.service.totalSlctdEmp ==
        this.service.leaveDetailsPendingForVoucher.employeeVoucherDetails.length
      ) {
        this.service.isAllEmpSlctdInVoucherCreation = true;
      }
    }
    this._SetDataAccordinglly();
  };

  searchingStart = false;

  /*Function for Search bar*/
  filterLeaveTable(event) {
    this.searchingStart = false;

    this.service.empVoucherDetailsToSearch = event.target.value
      ? this.service.leaveDetailsPendingForVoucher.employeeVoucherDetails.filter(
        elem => {
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
            this.searchingStart = true;
            return true;
          } else {
            this.searchingStart = true;
            return false;
          }
        }
      )
      : this.service.leaveDetailsPendingForVoucher.employeeVoucherDetails;
  }
  ngOnInit() {
  }
}
