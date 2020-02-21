import { Component, OnInit, Input } from '@angular/core';
import { ManageLeaveServiceService } from '../../../manage-leave-service.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { tick } from '@angular/core/src/render3';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: "app-el-voucher-creation",
  templateUrl: "./el-voucher-creation.component.html",
  styleUrls: ["./el-voucher-creation.component.scss"]
})
export class ElVoucherCreationComponent implements OnInit {
  constructor(
    public service: ManageLeaveServiceService,
    public serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService,
    public smartModal: NgxSmartModalService
  ) { }

  leaveVoucherCreatedDetails = {
    voucherDetails: []
  };
  noEmpSelectedForVoucherCreation = false;
  voucherDetailsInCreation = [];

  @Input("empDetail") empDetail;
  //function to check and Uncheck all the details

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
            ("" + elem.balanceLeaves)
              .toLowerCase()
              .indexOf(event.target.value.toLowerCase()) != -1 ||
            //shorthand for typecasting of number to string
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
  createLeaveEncashVoucher = () => {
    this.commonFunctionService
      .sweetAlertWithActions(
        "Confirmation",
        "Are you sure you want to create Voucher(s)",
        "warning",
        "Yes",
        "No"
      )
      .then(result => {
        if (result.value) {
          this.service._StartServerCall();
          let empDetails = [];
          for (
            let i = 0;
            i < this.service.empVoucherDetailsToSearch.length;
            i++
          ) {
            if (this.service.empVoucherDetailsToSearch[i].isSelected) {
              empDetails.push(this.service.empVoucherDetailsToSearch[i]);
            }
          }
          let companyId = this.service.companyDetails["CompanyId"];
          let companyLocationId = this.service.leaveManageObj.slctdLocation
            .companyLocationId;
          let request = {
            companyId,
            formId: this.service.formId,
            companyLocationId,
            leaveMonth: this.service.leaveManageObj.slctdLeaveMonth,
            employeeVoucherDetails: empDetails
          };
          this.serverService
            .post(
              { request },
              "leaveEncashmentModule/createLeaveEncashVoucher",
              {
                module: "humanResource"
              }
            )
            .subscribe(data => {
              this.service._EndServerCall();
              if (data["response"]) {
                this.leaveVoucherCreatedDetails = data.response;
                this.service.showVoucherCreatedDetails = true;
              }
              if (data.errorCode) {
                this.commonFunctionService.simpleSweetAlert(
                  data.errorTitle,
                  data.errorContent,
                  "error"
                );
              }
            });
        }
      });
  };

  voucherDetailInModal = {
    voucherNumber: null,
    voucherDate: null,
  };
  getVoucherDetails = _Index => {
    this.service._StartServerCall();
    let request = {
      companyId: this.service.companyDetails["CompanyId"],
      formId: this.service.formId,
      companyLocationId: this.service.leaveManageObj.slctdLocation
        .companyLocationId,
      leaveMonth: this.service.leaveManageObj.slctdLeaveMonth,
      voucherNumber: this.leaveVoucherCreatedDetails.voucherDetails[_Index]
        .voucherNumber,
      voucherDate: this.leaveVoucherCreatedDetails.voucherDetails[_Index]
        .voucherDate
    };
    this.serverService
      .post({ request }, "voucherModule/getVoucherDetails", {
        module: "financialStatement"
      })
      .subscribe(data => {
        this.service._EndServerCall();
        if (data.response.length != 0) {
          this.voucherDetailsInCreation = data.response;
          this.voucherDetailInModal = this.leaveVoucherCreatedDetails.voucherDetails[
            _Index
          ];
          this.smartModal.getModal("voucherDetailsInCreation").open();
        }
        if (data.response.length == 0) {
          this.commonFunctionService.simpleSweetAlert(
            "No Data Found!!",
            "No Voucher Details Found",
            "error"
          );
        }

        if (data.errorCode) {
          this.commonFunctionService.simpleSweetAlert(
            data.errorTitle,
            data.errorContent,
            "error"
          );
        }
      });
  };

  closeModal = () => {
    this.smartModal.getModal("voucherDetailsInCreation").close();
  };

  createAnotherVoucher() {
    this.service.animationState = "none";
    this.service.leaveDetailsPendingForVoucher.employeeVoucherDetails = [];
  }

  ngOnInit() { }
}