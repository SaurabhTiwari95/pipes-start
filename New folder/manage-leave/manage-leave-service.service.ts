import { Injectable } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import * as _moment from 'moment';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Injectable()
export class ManageLeaveServiceService {
  isAllEmpSlctdInVoucherCreation: boolean;
  filterreportDetailsForView    : any;
  totalEmpSlctdForSaveAttendance: number;
  totalSlctdEmp                 : number = 0;

  constructor(private state: StateService, private serverService : GetDataFromApiService, public commonFunctioService : CommonFunctionService) { }
  
  companyDetails         = this.state.getCompanyDetails();
  formId                 = '167';
  disabledButtonAndField = false;
  
  animationState : 'none' | 'step1' | 'step2' | 'step3' | 1 = 'none';
 showVoucherCreatedDetails : boolean = false;
  // flags for Voucher Payment
  
/* checkSalaryHoldReasonEntrdIfEmployeeNotSlctd */

  showStep1: boolean = false;
  showStep2: boolean = false;
  showStep3: boolean = false;

  totalAmountPayable = null;

  slctdEmployeesArray = [];
  

/* checkSalaryHoldReasonEntrdIfEmployeeNotSlctd */


  voucherCategory = [
    {
      categoryId   : "1",
      categoryName : "Voucher Creation"
    },
    {
      categoryId   : "2",
      categoryName : "Voucher Deletion"
    }
  ]

  allActionTypes = [
    {
      actionId    : 1,
      categoryName: "EL En-Cashment",
      categoryId  : 1,
      actionType  : "Generation",
    },
    {
      actionId    : 2,
      categoryName: "EL En-Cashment",
      categoryId  : 1,
      actionType  : "Voucher",
    },
    {
      actionId    : 3,
      categoryName: "EL En-Cashment",
      categoryId  : 1,
      actionType  : "Payment",
    }
  ];

  paymentModes = [
    {modeId : 1, modeName:"Computerized",  modeCode: "C"},
    {modeId : 2, modeName:"Manual",  modeCode: "M"}
  ]


  leaveManageObj = {
      slctdLocation: undefined,
      slctdAction  : {
        actionId             : null,
        categoryName         : null,
        categoryId           : null,
        actionType           : null,
        slctdVoucherCategory : null,
      },
      
    slctdLeaveMonth: moment().format('MMM-YYYY'),
    slctdPaymentMode : {
      modeName : null,
      modeId:null,
      modeCode : null,
    },
    bankDetails:[],
    chequeIssuerListDetails : [],
    chequeBookDetails:[],
    chequeNumberDetails : [],
    
    leaveEncashLedgerDetails:{
      ledgerDetails : {
        ledgerName : null,
        ledgerId : null,

      },
      cashGroupDetails : {
        cashGroupName : null,
        cashGroupId: null
      }
    }   
    
  }

  bankDetailObj = {
    slctdChequeBookIssuer: null,
    slctdBank: null,
    slctdChequeBook: null,
    slctdChequeNumber: null,
  };

  loadElEncashmentComp : boolean = false

  employeeDetails       = [];
  _HoldEmployeeDetails  = [];
  dataForTable          = [];
  empArrayForServerCall = [];
  leaveDetailsPendingForVoucher = {
    employeeVoucherDetails : [],
  };
  voucherTotalDetails = {
    totalVoucherAmount : 0
  };
  empVoucherDetailsToSearch = [];

  voucherDeletionDetails = {
    totalEmployees : null,
    voucherDetails :[]
  };


  empDetailsAccordingToBankArray = [];
  getBankDetails = [];
  printName = null;
  ledgerAccount = null;
  cashGroupName = null;

  calculateEncashElAmount = (_Index, _Type?) => {
    let _Array: any;
    if (_Type == 'Onload') {
      _Array = this.employeeDetails;
    } else {
      _Array = this.dataForTable;
    }
    _Array[_Index].encashedAmount = 0;
    _Array[_Index].encashedAmount = ((_Array[_Index].leavesEncashed * _Array[_Index].basicAmount) / 30).toFixed(2);
    +(_Array[_Index].encashedAmount)
  }

  hideTpls = true; 
  resetData = () =>{
    this.loadElEncashmentComp = false;
    this.employeeDetails       = [];
    this._HoldEmployeeDetails  = [];
    this.dataForTable          = [];
    this.empArrayForServerCall = []; 
    this.animationState        = 'none';
    this.hideTpls              = true;
    this._GetBankNames();
    this._GetChequeIssuerList();
    this._GetLeaveEncashLedgerDetails();

  } 

  _GetBankNames() {
    this.leaveManageObj.bankDetails = [];
    this._StartServerCall();
    let request = {
      companyLocationId: this.leaveManageObj.slctdLocation
        .companyLocationId,
      companyId: this.companyDetails.CompanyId,
      formId: this.formId
    };
    this.serverService
      .post({ request }, "mainModule/getBankNames", {
        module: "payment"
      })
      .subscribe(data => {
        if (data.response) {
          this.leaveManageObj.bankDetails = data.response;
          if (data.response.length == 0) {
            this.commonFunctioService.simpleSweetAlert("No Data Found!",
            "No employee details found for selected voucher month!", 'error')
          }
        }

        if (data.errorCode) {
          this.commonFunctioService.simpleSweetAlert(data.errorTitle,
            data.errorContent, 'error')
        }
      });
  };


  _GetChequeIssuerList() {
    this.leaveManageObj["chequeIssuerListDetails"] = [];
    let request = {
      companyLocationId: this.leaveManageObj.slctdLocation
        .companyLocationId,
      companyId: this.companyDetails.CompanyId,
      formId: this.formId
    };

    this.serverService
      .post({ request }, "mainModule/getChequeIssuerList", {
        module: "payment"
      })
      .subscribe(data => {
        this._EndServerCall();
        if (data.response) {
          this.leaveManageObj["chequeIssuerListDetails"] =
            data.response;
          if (data.response.length == 0) {
            this.commonFunctioService.simpleSweetAlert("No Data Found!",
            "No employee details found for selected voucher month!", 'error')
          }
        }
        if (data.errorCode) {
          this.commonFunctioService.simpleSweetAlert(data.errorTitle,
            data.errorContent, 'error')
        }
      });
  };

  _GetLeaveEncashLedgerDetails() {
    let request = {
      companyLocationId: this.leaveManageObj.slctdLocation
        .companyLocationId,
      companyId: this.companyDetails.CompanyId,
      formId: this.formId,
    };
    this.serverService
      .post({ request }, "leaveEncashmentModule/getLeaveEncashLedgerDetails", {
        module: "humanResource"
      })
      .subscribe(data => {
        if (data.response) {
          this.leaveManageObj["leaveEncashLedgerDetails"] = data.response;
            if(this.leaveManageObj[ "leaveEncashLedgerDetails" ].ledgerDetails != null)
            {
              this.printName = this.leaveManageObj[ "leaveEncashLedgerDetails" ].ledgerDetails.ledgerName;
              this.ledgerAccount = this.leaveManageObj[ "leaveEncashLedgerDetails"].ledgerDetails.ledgerName;
            }
          this.cashGroupName = this.leaveManageObj[
            "leaveEncashLedgerDetails"
          ].cashGroupDetails.cashGroupName;
          if (data.response.length == 0) {
            this.commonFunctioService.simpleSweetAlert("No Data Found!",
            "No employee details found for selected voucher month!", 'error')
          }
        }

        if (data.errorCode) {
          this.commonFunctioService.simpleSweetAlert(data.errorTitle,
            data.errorContent, 'error')
        }
      });
  };

  _StartServerCall = () => {
    this.state.progressBarStart();
    this.disabledButtonAndField = true
  }

  _EndServerCall = () =>{
    this.state.progressBarStop()
    this.disabledButtonAndField = false;
  }
}