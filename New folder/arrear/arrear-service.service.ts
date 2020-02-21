import { Injectable } from '@angular/core';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import * as _moment from 'moment';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Injectable({
  providedIn: 'root'
})
export class ArrearServiceService {
  // empArrayInArrearVoucher: any;
  // filteredArrayInArrearVoucher: any[];
  isAllEmpSlctdInVoucherCreation: boolean;
  totalSlctdEmp                 : number = 0;

  constructor(
    private state               : StateService,
    private serverService       : GetDataFromApiService,
    public commonFunctioService : CommonFunctionService
    ) { }
  
  companyDetails         = this.state.getCompanyDetails();
  formId                 = '170';
  disabledButtonAndField = false;
  
  arrearManageObj = {
    slctdLocation: undefined,
    slctdAction  : {
      actionId             : null,
      categoryName         : null,
      categoryId           : null,
      actionType           : null,
      slctdVoucherCategory : null,
    },

    arrearDaterange : {
      startDate : new Date(),
      endDate : new Date(),
      // format: 'YYYY-MM-DD'
    },

    slctdArrearMonth: moment().format('MMM-YYYY')
  }
  voucherTotalDetails = {
    totalVoucherAmount : 0
  };
  empVoucherDetailsToSearch = [];


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
      categoryName: "Arrear",
      categoryId  : 1,
      actionType  : "Arrear Voucher",
    },
    // {
    //   actionId    : 2,
    //   categoryName: "Arrear",
    //   categoryId  : 1,
    //   actionType  : "Voucher Deletion",
    // },
    {
      actionId    : 2,
      categoryName: "Arrear",
      categoryId  : 1,
      actionType  : "Arrear Payment",
    }

  ];
  paymentModes = [
    {modeId : 1, modeName:"Computerized",  modeCode: "C"},
    {modeId : 2, modeName:"Manual",  modeCode: "M"}
  ]

  voucherDeletionDetails = {
    totalEmployees : null,
    voucherDetails :[]
  };

  leaveDetailsPendingForVoucher = {
    employeeVoucherDetails : [],
  };
  
  _StartServerCall = () => {
    this.state.progressBarStart();
    this.disabledButtonAndField = true
  }

  _EndServerCall = () =>{
    this.state.progressBarStop()
    this.disabledButtonAndField = false;
  }

  resetData = () =>{
    // Data or Details you want to reset
  
  }

  empArrayInArrearVoucher = [
    // {
    //   isSelected: false,
    //   employeeId: null,
    //   employeeName: null,
    //   departmentName: null,
    //   divisionName: null,
    //   arrearAmount: null,
    //   arrearPercentage: null,
    //   arrearPayable: null,
    //   arrearMonth: null,
    // }
  ]

  filteredArrayInArrearVoucher = [
    // {
    //   isSelected: false,
    //   employeeId: null,
    //   employeeName: null,
    //   departmentName: null,
    //   divisionName: null,
    //   arrearAmount: null,
    //   arrearPercentage: null,
    //   arrearPayable: null,
    //   arrearMonth: null,
    // }
  ]
}
