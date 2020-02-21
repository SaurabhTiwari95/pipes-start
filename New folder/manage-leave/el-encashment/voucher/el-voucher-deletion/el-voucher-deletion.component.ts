import { Component, OnInit } from "@angular/core";
import { ManageLeaveServiceService } from "../../../manage-leave-service.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { StateService } from "src/app/shared/services/state.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { CommonFunctionService } from "src/app/shared/services/common-function.service";
import { NgxSmartModalService } from "ngx-smart-modal";

@Component({
  selector: "app-el-voucher-deletion",
  templateUrl: "./el-voucher-deletion.component.html",
  styleUrls: ["./el-voucher-deletion.component.scss"]
})
export class ElVoucherDeletionComponent implements OnInit {
  constructor(
    public service: ManageLeaveServiceService,
    public serverService: GetDataFromApiService,
    private state: StateService,
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

  voucherDetailModalObj = {
    arrayOfvoucherDetailsOfVoucherType: [],
    voucherNumber: null,
    voucherDate: null
  };

  LeaveVoucherDetailModalObj = {
    arrayOfvoucherDetailsOfVoucherType: [],
    voucherNumber: null,
    voucherDate: null
  };

  closeModal() {
    this.smartModal.getModal("voucherDetails").close();
  }

  closeAllVoucherDetails() {
    this.smartModal.getModal("voucherEmpDetails").close();
  }

  deleteLeaveEncashVoucher = _Index => {
    this.commonFunctionService
      .sweetAlertWithActions(
        "Confirmation!!",
        "Are You sure to delete Vouchcer(s) ?",
        "warning",
        "Cancel",
        "OK"
      )
      .then(result => {
        if (!result.value) {
          this.service._StartServerCall();
          let voucherNo = this.service.voucherDeletionDetails.voucherDetails[
            _Index
          ].voucherNo;
          let request = {
            companyId: this.service.companyDetails["CompanyId"],
            formId: this.service.formId,
            companyLocationId: this.service.leaveManageObj.slctdLocation
              .companyLocationId,
            leaveMonth: this.service.leaveManageObj.slctdLeaveMonth,
            voucherNumber: this.service.voucherDeletionDetails.voucherDetails[
              _Index
            ].voucherNo,
            voucherDate: this.service.voucherDeletionDetails.voucherDetails[
              _Index
            ].voucherArray[0].voucherDate
          };
          this.serverService
            .post(
              { request },
              "leaveEncashmentModule/deleteLeaveEncashVoucher",
              {
                module: "humanResource"
              }
            )
            .subscribe(data => {
              this.service._EndServerCall();
              if (data.response) {
                this.service.voucherDeletionDetails = data.response;
                this.commonFunctionService.simpleSweetAlert(
                  "Successful!!",
                  "Voucher with ( " +
                  "<b>" +
                  voucherNo +
                  "</b>" +
                  " ) has been deleted successfully.",
                  "success"
                );
              }
              if (data.errorCode) {
                this.commonFunctionService.simpleSweetAlert(
                  data.errorTitle,
                  data.errorContent,
                  "error"
                );
                this.service.voucherDeletionDetails.voucherDetails.splice(_Index, 1)
              }
            });
        } else {
          return;
        }
      });
  };
  searchingStart = false;

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

  getVoucherDetails = (_IndexOfChunk, _IndexOf) => {
    this.service._StartServerCall();
    let request = {
      companyId: this.service.companyDetails["CompanyId"],
      formId: this.service.formId,
      companyLocationId: this.service.leaveManageObj.slctdLocation
        .companyLocationId,
      leaveMonth: this.service.leaveManageObj.slctdLeaveMonth,
      voucherNumber: this.service.voucherDeletionDetails.voucherDetails[
        _IndexOfChunk
      ].voucherNo,
      voucherDate: this.service.voucherDeletionDetails.voucherDetails[
        _IndexOfChunk
      ].voucherArray[0].voucherDate
    };
    this.serverService
      .post({ request }, "voucherModule/getVoucherDetails", {
        module: "financialStatement"
      })
      .subscribe(data => {
        this.service._EndServerCall();
        if (data.response.length != 0) {
          this.voucherDetailModalObj.arrayOfvoucherDetailsOfVoucherType =
            data.response;
          this.voucherDetailModalObj.voucherNumber = this.service.voucherDeletionDetails.voucherDetails[
            _IndexOfChunk
          ].voucherNo;
          this.voucherDetailModalObj.voucherDate = this.service.voucherDeletionDetails.voucherDetails[
            _IndexOfChunk
          ].voucherArray[0].voucherDate;
          this.smartModal.getModal("voucherDetails").open();
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
          ("" + elem.encashedLeaves)
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) != -1 ||
          ("" + elem.encashedAmount)
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

  ngOnInit() { }
}
