import { Component, OnInit } from "@angular/core";
import { ManageLeaveServiceService } from "../../../manage-leave-service.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { StateService } from "src/app/shared/services/state.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { CommonFunctionService } from "src/app/shared/services/common-function.service";
import { DatepickerOptions } from "ng2-datepicker";

@Component({
  selector: "app-bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["./bank-details.component.scss"]
})
export class BankDetailsComponent implements OnInit {
  constructor(
    public service: ManageLeaveServiceService,
    public serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService
  ) { }

  bankDetailObj = {
    slctdBank: undefined,
    slctdChequeBookIssuer: undefined,
    slctdChequeBook: undefined,
    slctdChequeDate: undefined,
    chequeAmountInput: undefined,
    printNameInput: undefined,
    slctdChequeNumber: null
  };

  chequeDateOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: "DD/MM/YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0,
    barTitleIfEmpty: "Click to select a date",
    placeholder: "Click to select a date",
    addClass: "form-control",
    addStyle: {},
    fieldId: "my-date-picker1",
    useEmptyBarTitle: false
  };

  getChequeBookForIssuer = function () {
    if (!this.bankDetailObj.slctdChequeBookIssuer) return;
    this.service.leaveManageObj["chequeBookDetails"] = [];
    this.bankDetailObj.slctdChequeBook = null;
    this.service.bankDetailObj.slctdChequeBook = null;
    this.bankDetailObj.slctdChequeNumber = null;
    this.service.bankDetailObj.slctdChequeNumber = null;
    this.service._StartServerCall();
    let request = {
      companyLocationId: this.service.leaveManageObj.slctdLocation
        .companyLocationId,
      companyId: this.service.companyDetails.CompanyId,
      formId: this.service.formId,
      modeType: this.service.leaveManageObj.slctdPaymentMode.modeCode,
      bankId: this.bankDetailObj.slctdBank.bankId,
      issuedToId: this.bankDetailObj.slctdChequeBookIssuer.issuerEmployerId
    };

    this.serverService
      .post({ request }, "mainModule/getChequeBookForIssuer", {
        module: "payment"
      })
      .subscribe(data => {
        this.service._EndServerCall();
        if (data.response) {
          this.service.leaveManageObj["chequeBookDetails"] = data.response;
          if (data.response.length == 0) {
            this.commonFunctionService.simpleSweetAlert(
              "No Cheque Book Found",
              "No cheque book found for the selected cheque book issuer.",
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
  };

  getNextChequeNumberForManualChequeCreation = function () {
    if (!this.bankDetailObj.slctdChequeBook) return;
    this.service.leaveManageObj["chequeNumberDetails"] = {};
    this.bankDetailObj.slctdChequeNumber = null;
    this.service.bankDetailObj.slctdChequeNumber = null;
    let request = {
      companyLocationId: this.service.leaveManageObj.slctdLocation
        .companyLocationId,
      companyId: this.service.companyDetails.CompanyId,
      formId: this.service.formId,
      modeType: this.service.leaveManageObj.slctdPaymentMode.modeCode,
      bankId: this.bankDetailObj.slctdBank.bankId,
      chequeBookId: this.bankDetailObj.slctdChequeBook.issueId
    };
    this.service._StartServerCall();
    this.serverService
      .post(
        { request },
        "chequeModule/getNextChequeNumberForManualChequeCreation",
        {
          module: "payment"
        }
      )
      .subscribe(data => {
        this.service._EndServerCall();
        if (data.response) {
          this.service.leaveManageObj["chequeNumberDetails"] = data.response;
          if (data.response.length == 0) {
            this.commonFunctionService.simpleSweetAlert(
              "No Cheque Found",
              "No cheque found for the selected cheque book.",
              "error"
            );
          } else {
            this.bankDetailObj.slctdChequeNumber = this.service.leaveManageObj[
              "chequeNumberDetails"
            ].chequeNumber;
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
  };

  createLeaveEncashPayment = () => {
    this.commonFunctionService
      .sweetAlertWithActions(
        "Confirmation",
        "Are you sure you want to Make Payment",
        "warning",
        "Yes",
        "No"
      )
      .then(result => {
        if (result.value) {
          this.service._StartServerCall();
          let request = {
            companyLocationId: this.service.leaveManageObj.slctdLocation
              .companyLocationId,
            companyId: this.service.companyDetails.CompanyId,
            formId: this.service.formId,
            leaveMonth:
              new Date(this.service.leaveManageObj.slctdLeaveMonth).getMonth() +
              1,
            leaveYear: new Date(
              this.service.leaveManageObj.slctdLeaveMonth
            ).getFullYear(),
            employeeLeaveDetails: this.service.slctdEmployeesArray,
            modeType: this.service.leaveManageObj.slctdPaymentMode.modeCode,
            issuerEmployerId: this.bankDetailObj.slctdChequeBookIssuer
              .issuerEmployerId,
            //ledgerId: "0001", //Dummy Ledger Detail
            ledgerId: this.service.leaveManageObj.leaveEncashLedgerDetails
              .ledgerDetails.ledgerId,
            issueId: this.bankDetailObj.slctdChequeBook.issueId,
            chequeDate: this.bankDetailObj.slctdChequeDate,
            chequeNumber: this.bankDetailObj.slctdChequeNumber,
            bankId: this.bankDetailObj.slctdBank.bankId,
            chequeBookId: this.bankDetailObj.slctdChequeBook.issueId,
            printName: this.service.printName
          };
          this.serverService
            .post(
              { request },
              "leaveEncashmentModule/createLeaveEncashPayment",
              {
                module: "humanResource"
              }
            )
            .subscribe(data => {
              this.service._EndServerCall();
              if (data.response) {
                if (data.response.length == 0) {
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
      });
  };

  resetBankDependentFields() {
    this.bankDetailObj.slctdChequeBookIssuer = null;
    this.service.bankDetailObj.slctdChequeBookIssuer = null;
    this.bankDetailObj.slctdChequeBook = null;
    this.service.bankDetailObj.slctdChequeBook = null;
    this.bankDetailObj.slctdChequeNumber = null;
    this.service.bankDetailObj.slctdChequeNumber = null;
  }

  holdPreviousBankDetails() {
    this.service.bankDetailObj.slctdBank = this.bankDetailObj.slctdBank;
    this.service.bankDetailObj.slctdChequeBookIssuer = this.bankDetailObj.slctdChequeBookIssuer;
    this.service.bankDetailObj.slctdChequeBook = this.bankDetailObj.slctdChequeBook;
    this.service.animationState = "step1";
  }

  CheckIfBankDetailsAlreadyExist() {
    if (this.service.bankDetailObj.slctdBank != undefined) {
      this.bankDetailObj.slctdBank = this.service.bankDetailObj.slctdBank;
    }

    if (this.service.bankDetailObj.slctdChequeBookIssuer != undefined) {
      this.bankDetailObj.slctdChequeBookIssuer = this.service.bankDetailObj.slctdChequeBookIssuer;
    }

    if (this.service.bankDetailObj.slctdChequeBook != undefined) {
      this.bankDetailObj.slctdChequeBook = this.service.bankDetailObj.slctdChequeBook;
      setTimeout(() => {
        this.getNextChequeNumberForManualChequeCreation();
      }, 1000);
    }
  }

  resetPrintName = function () {
    this.service.printName = this.service.ledgerAccount;
  };

  ngOnInit() {
    this.bankDetailObj.slctdChequeDate = new Date();
    this.CheckIfBankDetailsAlreadyExist();
  }
}