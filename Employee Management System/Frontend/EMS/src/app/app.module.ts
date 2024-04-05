import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/SignUp/SignUp.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/admin/employee-list/employee-list.component';
import { AddEmployeeComponent } from './components/admin/add-employee/add-employee.component';
import { EmployeeDetailsComponent } from './components/admin/employee-details/employee-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http'; 
import { FooterComponent } from './components/footer/footer.component';
import { EmployeeService } from './services/employee.service';
import { UserDetailsComponent } from './components/User/user-details/user-details.component';
import { RequestLeaveFormComponent } from './components/User/request-leave-form/request-leave-form.component';
import { LeaveRequestsComponent } from './components/admin/leave-requests/leave-requests.component';
import { AuthService } from './services/Authservice';
import { AuthGuard } from './Authguard';
import { LogoutComponent } from './components/logout/logout.component';
import { HeaderComponent } from './components/header/header.component';
import { LeaveStatusComponent } from './components/User/leave-status/leavestatus.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DialogComponent } from './dialog/dialog.component';


const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'EmployeeList', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: 'AddEmployee', component: AddEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'employee-details/:id', component: EmployeeDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user-details/:email', component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user-details/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: 'request-leave', component: RequestLeaveFormComponent, canActivate: [AuthGuard] },
  { path: 'leave-requests', component: LeaveRequestsComponent, canActivate: [AuthGuard] },
   {path: 'emp-leavestatus/:id',component:LeaveStatusComponent,canActivate:[AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    EmployeeListComponent,
    AddEmployeeComponent,
    EmployeeDetailsComponent,
    FooterComponent,
    UserDetailsComponent,
    RequestLeaveFormComponent,
    LeaveRequestsComponent,
    LogoutComponent,
    HeaderComponent,
    LeaveStatusComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule, 
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }), // ToastrModule added
   // MatSnackBarModule, BrowserAnimationsModule,
  ],
  providers: [EmployeeService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
