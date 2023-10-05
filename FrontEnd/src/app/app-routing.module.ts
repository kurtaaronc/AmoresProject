import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './UI/home-page/home-page.component';
import { ViewPageComponent } from './UI/view-page/view-page.component';
import { CreatePageComponent } from './UI/create-page/create-page.component';
import { CreatePaymentComponent } from './UI/create-payment/create-payment.component';
import { DashboardComponent } from './UI/dashboard/dashboard.component';
import { UpdatePaymentDateComponent } from './UI/update-payment-date/update-payment-date.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'view/:transactionName', component: ViewPageComponent },
  { path: 'create', component: CreatePageComponent },
  { path: 'createPayment/:transactionName/:Id', component: CreatePaymentComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'updatePayment/:transactionName/:Id', component: UpdatePaymentDateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
