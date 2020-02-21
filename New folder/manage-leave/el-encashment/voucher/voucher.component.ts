import { Component, OnInit, Input } from "@angular/core";
import { ManageLeaveServiceService } from "../../manage-leave-service.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { StateService } from "src/app/shared/services/state.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { CommonFunctionService } from "src/app/shared/services/common-function.service";

@Component({
  selector   : "app-voucher",
  templateUrl: "./voucher.component.html",
  styleUrls  : ["./voucher.component.scss"]
})
export class VoucherComponent implements OnInit {
  constructor(
    public service              : ManageLeaveServiceService,
    public serverService        : GetDataFromApiService,
    private state               : StateService,
    public modal                : ModalService,
    public commonFunctionService: CommonFunctionService,
  ) {}

  ngOnInit() {}
}
