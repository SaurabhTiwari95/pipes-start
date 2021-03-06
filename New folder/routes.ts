import { Routes } from "@angular/router";
import { HrHomeComponent } from "./hr-home/hr-home.component";
import { OrgChartsComponent } from "./org-charts/org-charts.component";
import { SalaryPaymentCreationComponent } from "./salary-payment-creation/salary-payment-creation.component";
import { KpiMasterComponent } from "./training-module/kpi-master/kpi-master.component";
import { PositionMasterComponent } from "./position-master/manage/position-master.component";
// import { TimeOfficeHomeComponent } from "./time-office/time-office-home/time-office-home.component";
// import { CtcViewComponent } from "./ctc-folder/ctc-view/ctc-view.component";
import { PerformanceManagementSystemComponent } from "./performance-management-system/performance-management-system.component";
import { ViewReportComponent } from "./position-master/view-report/view-report.component";
import { TimeOfficeHomeComponent } from "./time-office/time-office-home/time-office-home.component";
import { CtcViewComponent } from "./ctc-folder/ctc-view/ctc-view.component";
import { CtcGenerateComponent } from './ctc-folder/ctc-generate/ctc-generate.component';
import { EmpHrSettingComponent } from "./emp-hr-setting/emp-hr-setting.component";
import { PmsReportsHomeComponent } from "./performance-management-system/pms-reports/reports-home/reports-home.component";
import { AttendanceComponent } from './attendance/attendance.component';
import { CanteenDeductionsComponent } from './canteen-deductions/canteen-deductions.component';
import { CanteenDeductionReportsComponent } from './canteen-deductions/canteen-deduction-reports/canteen-deduction-reports.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
// import { CtcTemplateComponent } from './ctc-folder/ctc-template/ctc-template.component';
//  import { EmpNewCtcComponent } from './employee-ctc/employee-new-ctc/./emp-new-ctc.component';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';
import { EmpNewCtcComponent } from './ctc-folder/employee-ctc/emp-new-ctc/emp-new-ctc.component';

import { ArrearComponent } from './arrear/arrear.component';



const _routes: Routes = [
  { path: "", pathMatch: "full", component: HrHomeComponent },
  {
    path: "hr-org-chart",
    component: OrgChartsComponent,
    data: { state: "form" }
  },
  {
    path: "key-performance-indicator",
    component: KpiMasterComponent,
    data: { state: "form" }
  },
  {
    path: "payroll-system",
    component: SalaryPaymentCreationComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "time-office",
    component: TimeOfficeHomeComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "ctc-view",
    component: CtcViewComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "recruitment",
    component: CtcGenerateComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "postion-master",
    component: PositionMasterComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "performance-management-system",
    component: PerformanceManagementSystemComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "postion-master-report",
    component: ViewReportComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "employee-hr-setting",
    component: EmpHrSettingComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "attendance",
    component: AttendanceComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "attendance-report",
    component: AttendanceReportComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "performance-management-system-report",
    component: PmsReportsHomeComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "canteen-deductions",
    component: CanteenDeductionsComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "canteen-deduction-reports",
    component: CanteenDeductionReportsComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  
  {
    path: "manage-leave",
    component: ManageLeaveComponent,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "employee-ctc",
    component: EmpNewCtcComponent ,
    data: { state: "form" },
    pathMatch: "full"
  },
  {
    path: "arrear",
    component: ArrearComponent,
    data: { state:"form" },
    pathMatch: "full"
  }
];

export { _routes };
