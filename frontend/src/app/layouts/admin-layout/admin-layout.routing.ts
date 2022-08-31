import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { CustomerActivityComponent } from '../../pages/customer-activity/customer-activity.component';
import { ActivityLogComponent } from '../../pages/customer-activity-log/activitylog.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { PendingPaymentsComponent } from '../../pages/pending-payments/pendingpayments.component';
import { PaymentHistoryComponent } from '../../pages/payment-history/paymenthistory.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'user-profile/:_id',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'pendingpayments',         component: PendingPaymentsComponent },
    { path: 'paymenthistory',         component: PaymentHistoryComponent },
    { path: 'customer-activity',   component: CustomerActivityComponent },
    { path: 'activitylog',   component: ActivityLogComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent }
];
