import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ManageLeaveServiceService } from "../../manage-leave-service.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { StateService } from "src/app/shared/services/state.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { CommonFunctionService } from "src/app/shared/services/common-function.service";
//import * as _ from "lodash"; used to compare two objects
@Component({
  selector: "app-generation",
  templateUrl: "./generation.component.html",
  styleUrls: ["./generation.component.scss"]
})
export class GenerationComponent implements OnInit {
  constructor(
    public service: ManageLeaveServiceService,
    public serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService
  ) { }

  /*Function for Search bar*/
  filterLeaveTable(event) {
    this.service.dataForTable = event.target.value
      ? this.service.employeeDetails.filter(elem => {
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
          return true;
        } else {
          return false;
        }
      })
      : this.service.employeeDetails;
  }

  checkEncashEL = _Row => {
    let _EmpIndexFromHoldArray = this.commonFunctionService.getObjIndexInArray(
      this.service._HoldEmployeeDetails,
      "employeeId",
      _Row.employeeId
    );
    let _Index = this.commonFunctionService.getObjIndexInArray(
      this.service.dataForTable,
      "employeeId",
      _Row.employeeId
    );

    this.service.dataForTable[_Index].encashElChanged = false;
    if (
      _Row.leavesEncashed !=
      this.service._HoldEmployeeDetails[_EmpIndexFromHoldArray].leavesEncashed
    ) {
      this.service.dataForTable[_Index].encashElChanged = true;
    }

    if (
      _Row.leavesEncashed >
      this.service._HoldEmployeeDetails[_EmpIndexFromHoldArray]
        .balanceLeaves ||
      _Row.leavesEncashed < 0
    ) {
      this.service.dataForTable[_Index].encashedAmount = "Invalid EL Count";
    } else {
      this.service.calculateEncashElAmount(_Index);
      this.service.empArrayForServerCall[
        _EmpIndexFromHoldArray
      ].leavesEncashed = _Row.leavesEncashed;
      this.service.empArrayForServerCall[
        _EmpIndexFromHoldArray
      ].leavesEncashed = JSON.parse(JSON.stringify(_Row.leavesEncashed));
      console.log(_Row.leavesEncashed);
      console.log(
        this.service.empArrayForServerCall[_EmpIndexFromHoldArray]
          .leavesEncashed
      );
      this.service.empArrayForServerCall[
        _EmpIndexFromHoldArray
      ].encashedAmount = _Row.encashedAmount;
    }
  };

  dataNotChanged;

  upsertleavesEncashed = () => {
    this.commonFunctionService
      .sweetAlertWithActions(
        "Confirmation!!!",
        "Are you sure to update earned leaves?",
        "warning",
        "Cancel",
        "OK"
      )
      .then(result => {
        if (!result.value) {
          this.service._StartServerCall();
          let companyId = this.service.companyDetails["CompanyId"];
          let companyLocationId = this.service.leaveManageObj.slctdLocation
            .companyLocationId;
          let _EmpDetails = [];
          for (var i in this.service.empArrayForServerCall) {
            // if (this.service.empArrayForServerCall[i].leavesEncashed > 0) {
            _EmpDetails.push(this.service.empArrayForServerCall[i]);
            // }
          }
          let request = {
            companyId,
            formId: this.service.formId,
            companyLocationId,
            empDetails: _EmpDetails,
            leaveMonth: this.service.leaveManageObj.slctdLeaveMonth
          };
          this.serverService
            .post({ request }, "leaveEncashmentModule/upsertleavesEncashed", {
              module: "humanResource"
            })
            .subscribe(data => {
              this.service._EndServerCall();
              if (data.status == 'success') {
                this.commonFunctionService.simpleSweetAlert(
                  "Successful",
                  data.response
                );
                this.service.resetData();
              }
              if (data.errorTitle) {
                this.commonFunctionService.simpleSweetAlert(
                  data.errorTitle,
                  data.errorContent,
                  "danger"
                );
              }
            });
        } else {
          return;
        }
      });
  };

  ngOnInit() {
    this.dataNotChanged = () => {
      let count = 1;
      for (var i in this.service._HoldEmployeeDetails) {
        for (var j in this.service.dataForTable) {
          if (
            this.service.dataForTable[j].employeeId ==
            this.service._HoldEmployeeDetails[i].employeeId
          ) {
            if (
              this.service.dataForTable[j].leavesEncashed >
              this.service._HoldEmployeeDetails[i].balanceLeaves
            ) {
              count = 0;
            }
          } else if (
            this.service.dataForTable[j].leavesEncashed == null ||
            this.service.dataForTable[j].leavesEncashed < 0
          ) {
            count = 0;
          }
        }
      }
      return count;
    };
  }
}
