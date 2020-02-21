import { Component, OnInit } from "@angular/core";
import { CommonFunctionService } from "src/app/shared/services/common-function.service";
import { ManageLeaveServiceService } from "../manage-leave-service.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { StateService } from "src/app/shared/services/state.service";
import { ModalService } from "src/app/shared/services/modal.service";

@Component({
  selector   : "app-el-encashment",
  templateUrl: "./el-encashment.component.html",
  styleUrls  : ["./el-encashment.component.scss"]
})
export class ElEncashmentComponent implements OnInit {
  constructor(
    public service              : ManageLeaveServiceService,
    public serverService        : GetDataFromApiService,
    private state               : StateService,
    public modal                : ModalService,
    public commonFunctionService: CommonFunctionService,
  ) {}

  ngOnInit() {}
}
