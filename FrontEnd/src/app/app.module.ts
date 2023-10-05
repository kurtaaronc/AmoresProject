import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from 'src/app/UI/home-page/home-page.component';
import { ViewPageComponent } from 'src/app/UI/view-page/view-page.component';
import { CreatePageComponent } from 'src/app/UI/create-page/create-page.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { CreatePaymentComponent } from './UI/create-payment/create-payment.component';
import { DashboardComponent } from './UI/dashboard/dashboard.component';
import { SideNavComponent } from './UI/side-nav/side-nav.component';
import { MainDashboardComponent } from './UI/main-dashboard/main-dashboard.component';
import { TopWidgetsComponent } from './UI/top-widgets/top-widgets.component';
import { ModalComponent } from './UI/modal/modal.component';
import { UpdatePaymentDateComponent } from './UI/update-payment-date/update-payment-date.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ViewPageComponent,
    CreatePageComponent,
    CreatePaymentComponent,
    DashboardComponent,
    SideNavComponent,
    MainDashboardComponent,
    TopWidgetsComponent,
    ModalComponent,
    UpdatePaymentDateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatDialogModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
