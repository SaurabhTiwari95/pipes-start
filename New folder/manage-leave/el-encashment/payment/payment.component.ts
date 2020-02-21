import { Component, OnInit } from '@angular/core';
import { ManageLeaveServiceService } from '../../manage-leave-service.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';

@Component({
  selector   : 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls  : ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(
    public service              : ManageLeaveServiceService,
    public serverService        : GetDataFromApiService,
    private state               : StateService,
    public modal                : ModalService,
    public commonFunctionService: CommonFunctionService,
  ) { }

  ngOnInit() {
  }
}
