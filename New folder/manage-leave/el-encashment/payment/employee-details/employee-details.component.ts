import { Component, OnInit } from "@angular/core";
import { ManageLeaveServiceService } from "../../../manage-leave-service.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { StateService } from "src/app/shared/services/state.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { CommonFunctionService } from "src/app/shared/services/common-function.service";

@Component({
  selector   : "app-employee-details",
  templateUrl: "./employee-details.component.html",
  styleUrls  : ["./employee-details.component.scss"]
})
export class EmployeeDetailsComponent implements OnInit {
  constructor(
    public service              : ManageLeaveServiceService,
    public serverService        : GetDataFromApiService,
    private state               : StateService,
    public modal                : ModalService,
    public commonFunctionService: CommonFunctionService
  ) {}

  indexOfSlctdChunk;
//Store Index of Bank Chunk 
  getIndexOfChunkSlctd(_Index) {
    this.indexOfSlctdChunk = _Index;
    this.service.empDetailsAccordingToBankArray[this.indexOfSlctdChunk].filteredDataOfSlctdChunk = [];
    this.service.empDetailsAccordingToBankArray[this.indexOfSlctdChunk].employeeArray.map((elem, i) => {
      elem.originalIndex = i;
      this.service.empDetailsAccordingToBankArray[this.indexOfSlctdChunk].filteredDataOfSlctdChunk.push(elem);
    });
    this.service.empDetailsAccordingToBankArray[this.indexOfSlctdChunk].filteredDataOfSlctdChunk = [...this.service.empDetailsAccordingToBankArray[this.indexOfSlctdChunk].filteredDataOfSlctdChunk];
  }

  checkIfAllEmpSlctd(_Index) {
    if (this.service.empDetailsAccordingToBankArray[_Index].allEmpSlctd) {
      this.service.empDetailsAccordingToBankArray[_Index].slctdChunkOfBank = true; 
      for (let i = 0,Length = this.service.empDetailsAccordingToBankArray[_Index].employeeArray.length;i < Length;i++ ) {
        this.service.empDetailsAccordingToBankArray[ _Index ].employeeArray[i].isSelected = true;
        this.service.empDetailsAccordingToBankArray[ _Index ].employeeArray = [ ...this.service.empDetailsAccordingToBankArray[_Index] .employeeArray ];
      }
    } else {
      this.service.empDetailsAccordingToBankArray[ _Index ].slctdChunkOfBank = false;
      for ( let i = 0, Length = this.service.empDetailsAccordingToBankArray[ _Index ].employeeArray.length; i < Length; i++ ) { 
        this.service.empDetailsAccordingToBankArray[ _Index].employeeArray[i].isSelected = false;
        this.service.empDetailsAccordingToBankArray[_Index].employeeArray = [ ...this.service.empDetailsAccordingToBankArray[_Index].employeeArray ];
      }
    }
    this._CalculateEmpAndAmt(_Index);
  }

  checkIfEmployeeSlctdForPaymentCreation(_Row, _ChunkIndex, e) {
    if (!e.target.checked) {
      _Row.isSelected = false;
      this.service.empDetailsAccordingToBankArray[_ChunkIndex].employeeArray[ _Row.originalIndex ].isSelected = false;
      this.service.empDetailsAccordingToBankArray[_ChunkIndex].totalEmployeeSlctd--;
      this.service.empDetailsAccordingToBankArray[ _ChunkIndex ].totalAmountToShow -= _Row.encashedAmount;
      this.service.empDetailsAccordingToBankArray[_ChunkIndex].allEmpSlctd = false;
    } else {
      _Row.isSelected = true;
      this.service.empDetailsAccordingToBankArray[_ChunkIndex].employeeArray[_Row.originalIndex].isSelected = true;
      this.service.empDetailsAccordingToBankArray[_ChunkIndex].totalEmployeeSlctd++;
      this.service.empDetailsAccordingToBankArray[_ChunkIndex].totalAmountToShow += _Row.encashedAmount;
      if (
        this.service.empDetailsAccordingToBankArray[_ChunkIndex].totalEmployeeSlctd == this.service.empDetailsAccordingToBankArray[_ChunkIndex].totalEmployees
      ) {
        this.service.empDetailsAccordingToBankArray[_ChunkIndex].allEmpSlctd = true;
      }
      if (
        this.service.empDetailsAccordingToBankArray[_ChunkIndex].filteredDataOfSlctdChunk[_Row.bankDetails.accountNumber]
      ) {
        this.service.empDetailsAccordingToBankArray[_ChunkIndex].employeeArray[_Row.originalIndex].bankDetails.accountNumber = this.service.empDetailsAccordingToBankArray[_ChunkIndex].filteredDataOfSlctdChunk[_Row.bankDetails.accountNumber];
      }
    }

    this._CalculateEmpAndAmt(_ChunkIndex);
  }

  _CalculateEmpAndAmt = function(_ChunkIndex) {
    this.service.empDetailsAccordingToBankArray[
      _ChunkIndex
    ].totalEmployeeSlctd = 0;

    this.service.empDetailsAccordingToBankArray[
      _ChunkIndex
    ].totalAmountToShow = 0;

    for (
      let j = 0,
        Length = this.service.empDetailsAccordingToBankArray[_ChunkIndex]
          .employeeArray.length;
      j < Length;
      j++
    ) {
      if (
        this.service.empDetailsAccordingToBankArray[_ChunkIndex].employeeArray[
          j
        ].isSelected
      ) {
        this.service.empDetailsAccordingToBankArray[_ChunkIndex]
          .totalEmployeeSlctd++;

        this.service.empDetailsAccordingToBankArray[
          _ChunkIndex
        ].totalAmountToShow += this.service.empDetailsAccordingToBankArray[
          _ChunkIndex
        ].employeeArray[j].encashedAmount;
      }
    }
  };

  
  /*checkSalaryHoldReasonEntrdIfEmployeeNotSlctd() Starts here*/
  ChunkOfBankNotSltd = false;
  EmpNotSelected = false;

  checkIfEmployeeNotSlctdOnNextBtn() {
    this.service.totalAmountPayable = 0;
    this.service.slctdEmployeesArray = [];
    this.ChunkOfBankNotSltd = false;
    this.EmpNotSelected = false;
    var countOfChunk = 0;

    for (
      let i = 0, Length = this.service.empDetailsAccordingToBankArray.length;
      i < Length;
      i++
    ) {
      var count = 0;

      if (this.service.empDetailsAccordingToBankArray[i].slctdChunkOfBank) {
        this.service.totalAmountPayable += this.service.empDetailsAccordingToBankArray[
          i
        ].totalAmountToShow;
        countOfChunk++;

        for (
          let j = 0,
            EmpLength = this.service.empDetailsAccordingToBankArray[i]
              .employeeArray.length;
          j < EmpLength;
          j++
        ) {
          if (
            this.service.empDetailsAccordingToBankArray[i].employeeArray[j]
              .isSelected &&
            !this.service.empDetailsAccordingToBankArray[i].employeeArray[j]
              .bankDetails.bankName &&
            !this.service.empDetailsAccordingToBankArray[i].employeeArray[j]
              .bankDetails.accountNumber
          ) {
            this.modal.openModal(
              "Warning",
              "Bank name and account number are compulsory for making payment for employee selected!"
            );
            return;
          }
          count++;
          this.service.slctdEmployeesArray.push(
            this.service.empDetailsAccordingToBankArray[i].employeeArray[j]
          );
        }
        if (count == 0) {
          this.EmpNotSelected = true;
        }
      }
    }

    if (countOfChunk == 0) {
      this.service.slctdEmployeesArray.length = 0;
      this.modal.openModal("Warning", " Employee chunk not selected");
      return;
    } else if (this.EmpNotSelected) {
      this.service.slctdEmployeesArray.length = 0;
      this.modal.openModal("Warning", "Employee not selected");
      return;
    } else {
      this.service.animationState = "step2";
      this.service.showStep2 = true;
      this.service.showStep1 = false;
      this.service.showStep3 = false;
    }
  }

  /*checkSalaryHoldReasonEntrdIfEmployeeNotSlctd() Ends Here*/

  filterDatatable(event, _IndexOfChunk, _RowOfChunk) {
    // this.service.empDetailsAccordingToBankArray[ _IndexOfChunk ].filteredDataOfSlctdChunk = [...this.service.empDetailsAccordingToBankArray[_IndexOfChunk].employeeArray];
    // this.service.empDetailsAccordingToBankArray[ _IndexOfChunk ].filteredDataOfSlctdChunk = event.target.value ? this.service.empDetailsAccordingToBankArray[ _IndexOfChunk ].employeeArray.filter(elem => {
    //   if ( elem.employeeName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
    //        elem.departmentName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1
    //       ) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     })
    //   : this.service.empDetailsAccordingToBankArray[_IndexOfChunk].employeeArray;
    _RowOfChunk.filteredDataOfSlctdChunk = [..._RowOfChunk.employeeArray];
    _RowOfChunk.filteredDataOfSlctdChunk = event.target.value ? _RowOfChunk.employeeArray.filter(elem => {
      if ( elem.employeeName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
           elem.departmentName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1
          ) {
            return true;
          } else {
            return false;
          }
        })
      : _RowOfChunk.employeeArray;
  }

  ngOnInit() {}
}
