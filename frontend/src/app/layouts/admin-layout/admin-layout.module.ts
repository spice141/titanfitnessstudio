import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { PendingPaymentsComponent } from '../../pages/pending-payments/pendingpayments.component';
import { PaymentHistoryComponent } from '../../pages/payment-history/paymenthistory.component';
import { CustomerActivityComponent } from '../../pages/customer-activity/customer-activity.component';
import { ActivityLogComponent } from '../../pages/customer-activity-log/activitylog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from "ng2-file-upload";  
import { FilterPipe }from '../../filter.pipe';
// import { ToastrModule } from 'ngx-toastr';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    FileUploadModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    PendingPaymentsComponent,
    PaymentHistoryComponent,
    CustomerActivityComponent,
    ActivityLogComponent,
    IconsComponent,
    MapsComponent,
    FilterPipe
  ]
})

export class AdminLayoutModule {}
