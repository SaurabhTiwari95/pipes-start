import { Component, OnInit, AfterViewInit } from "@angular/core";
import * as _moment from "moment";
import { Moment } from "moment";
import { ManageLeaveServiceService } from "./manage-leave-service.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { StateService } from "src/app/shared/services/state.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { CommonFunctionService } from "src/app/shared/services/common-function.service";
import { anima } from "../manage-leave/animation";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector   : "app-manage-leave",
  templateUrl: "./manage-leave.component.html",
  styleUrls  : ["./manage-leave.component.scss"],
  providers  : [ManageLeaveServiceService],
  animations : [anima]
})
export class ManageLeaveComponent implements OnInit {
  constructor(
    public service              : ManageLeaveServiceService,
    public serverService        : GetDataFromApiService,
    private state               : StateService,
    public modal                : ModalService,
    public commonFunctionService: CommonFunctionService
  ) {}

  locations = [];

  getAllLocations() {
    let companyId = this.service.companyDetails["CompanyId"];
    let request = { companyId, formId: this.service.formId };
    this.serverService
      .post({ request }, "commonUIfunctionsModule/getLocationsForThisUser", {
        module: "vendor"
      })
      .subscribe(data => {
        if (data["response"]) {
          this.locations = data["response"];
        }
      });
  }

  /*
  handleMonthElLeaveInCash(ref, event: Moment) {
    this.service.leaveManageObj.slctdLeaveMonth = moment(event).format('MMM-YYYY');
    
    ref.close();
  }

  openCalender(ref) {
    ref.open();
  }
*/

  getEmpForLeaveEncash = () => {
    this.service._StartServerCall();
    this.service.resetData();
    let companyId = this.service.companyDetails["CompanyId"];
    let companyLocationId = this.service.leaveManageObj.slctdLocation
      .companyLocationId;
    let request = {
      companyId,
      formId: this.service.formId,
      companyLocationId,
      leaveMonth: this.service.leaveManageObj.slctdLeaveMonth
    };
    this.serverService
      .post({ request }, "leaveEncashmentModule/getEmpForLeaveEncash", {
        module: "humanResource"
      })
      .subscribe(data => {
        this.service._EndServerCall();
        if (data["response"]) {
          this.service.employeeDetails = data["response"];
          this.service._HoldEmployeeDetails = JSON.parse(
            JSON.stringify(this.service.employeeDetails)
          );
          this.service.dataForTable = JSON.parse(
            JSON.stringify(this.service.employeeDetails)
          );
          this.service.loadElEncashmentComp = true;
          this.service.empArrayForServerCall = JSON.parse(
            JSON.stringify(this.service.employeeDetails)
          );
          this.service.animationState = 1;
          this.service.hideTpls = false;
          if (this.service.leaveManageObj.slctdAction.actionId == 3) {
            this.service.animationState = "step1";
          }
          this.checkBoxvaluesAtLoadTime();
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

  getLeavePendingForVoucher = () => {
    this.service._StartServerCall();
    let request = {
      companyId: this.service.companyDetails["CompanyId"],
      formId: this.service.formId,
      companyLocationId: this.service.leaveManageObj.slctdLocation
        .companyLocationId,
      leaveMonth: this.service.leaveManageObj.slctdLeaveMonth
    };
    this.serverService
      .post({ request }, "leaveEncashmentModule/getLeavePendingForVoucher", {
        module: "humanResource"
      })
      .subscribe(data => {
        this.service._EndServerCall();
        if (data.response) {
          this.service.leaveDetailsPendingForVoucher.employeeVoucherDetails = JSON.parse(
            JSON.stringify(data.response.employeeVoucherDetails)
          );
          this.service.voucherTotalDetails = JSON.parse(
            JSON.stringify(data.response.voucherTotalDetails)
          );
          this.service.empVoucherDetailsToSearch = JSON.parse(
            JSON.stringify(
              this.service.leaveDetailsPendingForVoucher.employeeVoucherDetails
            )
          );

          let count = 0;
          for (let emp of this.service.empVoucherDetailsToSearch) {
            if (emp.isSelected) {
              count++;
              this.service.totalSlctdEmp++;
            }
          }
          if (count == this.service.empVoucherDetailsToSearch.length) {
            this.service.isAllEmpSlctdInVoucherCreation = true;
          } else {
            this.service.isAllEmpSlctdInVoucherCreation = false;
          }
          // this.checkBoxvaluesAtLoadTime();
          this.service.loadElEncashmentComp = true;
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

  getLeaveVoucherForDeletion = () => {
    this.service._StartServerCall();
    let request = {
      companyId: this.service.companyDetails["CompanyId"],
      formId: this.service.formId,
      companyLocationId: this.service.leaveManageObj.slctdLocation
        .companyLocationId,
      leaveMonth: this.service.leaveManageObj.slctdLeaveMonth
    };
    this.serverService
      .post({ request }, "leaveEncashmentModule/getLeaveVoucherForDeletion", {
        module: "humanResource"
      })
      .subscribe(data => {
        this.service._EndServerCall();
        if (data.response) {
          this.service.voucherDeletionDetails = data.response;
          this.service.loadElEncashmentComp = true;
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

  getLeavePendingForPayment = () => {
    this.service._StartServerCall();
    let request = {
      companyId: this.service.companyDetails["CompanyId"],
      formId: this.service.formId,
      companyLocationId: this.service.leaveManageObj.slctdLocation
        .companyLocationId,
      leaveMonth:
        new Date(this.service.leaveManageObj.slctdLeaveMonth).getMonth() + 1,
      leaveYear: new Date(
        this.service.leaveManageObj.slctdLeaveMonth
      ).getFullYear(),
      paymentMode: this.service.leaveManageObj.slctdPaymentMode.modeName
    };
    this.serverService
      .post({ request }, "leaveEncashmentModule/getLeavePendingForPayment", {
        module: "humanResource"
      })
      .subscribe(data => {
        this.service._EndServerCall();
        if (data.response) {
          this.service.empDetailsAccordingToBankArray = data.response;

          for (
            let i = 0,
              Length1 = this.service.empDetailsAccordingToBankArray.length;
            i < Length1;
            i++
          ) {
            this.service.empDetailsAccordingToBankArray[
              i
            ].totalEmployeeSlctd = this.service.empDetailsAccordingToBankArray[
              i
            ].totalEmployees;
            this.service.empDetailsAccordingToBankArray[i].allEmpSlctd = false;

            let count = 0;
            this.service.empDetailsAccordingToBankArray[
              i
            ].totalAmountToShow = 0;
            let Length2 = this.service.empDetailsAccordingToBankArray[i]
              .employeeArray.length;
            for (let j = 0; j < Length2; j++) {
              if (
                this.service.empDetailsAccordingToBankArray[i].employeeArray[j]
                  .isSelected
              ) {
                count++;
                this.service.empDetailsAccordingToBankArray[
                  i
                ].totalAmountToShow += this.service.empDetailsAccordingToBankArray[
                  i
                ].employeeArray[j].encashedAmount;
              }
              if (
                this.service.empDetailsAccordingToBankArray[i].employeeArray[j]
                  .bankDetails.accountNumber
              ) {
                let unFormattedAccountNumber = this.service
                  .empDetailsAccordingToBankArray[i].employeeArray[j]
                  .bankDetails.accountNumber;
                this.service.empDetailsAccordingToBankArray[i].employeeArray[
                  j
                ].bankDetails.accountNumber = unFormattedAccountNumber.replace(
                  /.(?=.{4})/g,
                  "X"
                );
              }
            }
            if (count > 0) {
              this.service.empDetailsAccordingToBankArray[
                i
              ].slctdChunkOfBank = true;
              if (count == Length2) {
                this.service.empDetailsAccordingToBankArray[
                  i
                ].allEmpSlctd = true;
                this.service.empDetailsAccordingToBankArray[
                  i
                ].slctdChunkOfBank = true;
              }

              this.service.empDetailsAccordingToBankArray[
                i
              ].totalEmployeeSlctd = count;
            } else {
              this.service.empDetailsAccordingToBankArray[
                i
              ].slctdChunkOfBank = false;
              this.service.empDetailsAccordingToBankArray[
                i
              ].totalEmployeeSlctd = 0;
            }
          }

          this.getCompanyBankDetails();
          this.service.loadElEncashmentComp = true;
          this.service.animationState = "step1";
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

  getCompanyBankDetails() {
    this.service.getBankDetails = [];
    let request = {
      companyLocationId: this.service.leaveManageObj.slctdLocation
        .companyLocationId,
      companyId: this.service.companyDetails.CompanyId,
      formId: this.service.formId
    };
    this.serverService
      .post({ request }, "salaryPaymentModule/getCompanyBankDetails", {
        module: "humanResource"
      })
      .subscribe(data => {
        if (data.response) {
          this.service.getBankDetails = data.response;

          if (data.response.length == 0) {
            this.commonFunctionService.simpleSweetAlert(
              "No Data Found!",
              "No employee details found for selected voucher month!",
              "error"
            );
          }
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

  serverCallsInElEncash() {
    if (
      this.service.leaveManageObj.slctdAction &&
      this.service.leaveManageObj.slctdAction.actionId == 1
    ) {
      this.getEmpForLeaveEncash();
    } else if (
      this.service.leaveManageObj.slctdAction &&
      this.service.leaveManageObj.slctdAction.actionId == 2
    ) {
      if (
        this.service.leaveManageObj.slctdAction.slctdVoucherCategory
          .categoryId == "1"
      ) {
        this.getLeavePendingForVoucher();
      } else {
        this.getLeaveVoucherForDeletion();
      }
    } else if (
      this.service.leaveManageObj.slctdAction &&
      this.service.leaveManageObj.slctdAction.actionId == 3
    ) {
      this.getLeavePendingForPayment();
    }
  }

  checkBoxvaluesAtLoadTime = () => {
    this.service.totalSlctdEmp = 0;
    for (let i = 0; i < this.service.empVoucherDetailsToSearch.length; i++) {
      if (this.service.empVoucherDetailsToSearch[i].isSelected) {
        this.service.totalSlctdEmp++;
      }
    }
  };

  handleMonthElLeaveInCash(ref, event: Moment) {
    this.service.leaveManageObj.slctdLeaveMonth = moment(event).format(
      "MMM-YYYY"
    );
    var b = moment(
      "01/" +
        this.service.leaveManageObj.slctdLeaveMonth.slice(0, 3) +
        "/" +
        this.service.leaveManageObj.slctdLeaveMonth.slice(4, 8)
    );
    var date = moment(new Date());
    var currentDate = moment(date);

    if (b > currentDate) {
      this.modal.openModal(
        "Error :Invalid Month-Year",
        "Leave Month must not be grater than current month"
      );
      this.service.leaveManageObj.slctdLeaveMonth = this.commonFunctionService.dateFormat(
        new Date(),
        "MMM-yyyy"
      );
    }
    ref.close();
    this.service.resetData();
  }
  openCalender(ref) {
    ref.open();
  }
  ngOnInit() {
    this.getAllLocations();
    this.service.leaveManageObj.slctdAction = null;
    this.service.leaveManageObj.slctdPaymentMode = null;
  }
}
