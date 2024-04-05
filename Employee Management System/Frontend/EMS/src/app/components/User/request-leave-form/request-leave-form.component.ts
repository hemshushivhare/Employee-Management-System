import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-leave-form',
  templateUrl: './request-leave-form.component.html',
  styleUrls: ['./request-leave-form.component.css']
})
export class RequestLeaveFormComponent implements OnInit {
  leaveForm: FormGroup;
  private baseUrl = 'http://localhost:8080';
  remainingLeaves: number = 0; // Added property to store remaining leaves

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastr:ToastrService
  ) {
    this.leaveForm = this.fb.group({
      employeeId: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const employeeIdFromQuery = params['empId'];

      if (employeeIdFromQuery) {
        this.leaveForm.get('employeeId')!.setValue(employeeIdFromQuery);
      }

      const userEmail = localStorage.getItem('Email') || '';

      if (userEmail) {
        this.employeeService.getEmployeeByEmail(userEmail).subscribe(
          loggedInEmployees => {
            const loggedInEmployee = loggedInEmployees[0];
            if (loggedInEmployee) {
              this.remainingLeaves = loggedInEmployee.remainingLeaves || 0;
              console.log('Remaining Leaves:', this.remainingLeaves);
            } else {
              console.error('No employee details found for the logged-in user.');
            }
          },
          error => {
            console.error('Error fetching employee details:', error);
            if(error.status === 401){
              this.router.navigate(["/"])
            }
          }
        );
      }
    });
  }

  onSubmit() {
    const email = localStorage.getItem('Email') || '';
    if (this.leaveForm.valid) {
      const requestedStartDate = new Date(this.leaveForm.get('startDate')!.value);
      const requestedEndDate = new Date(this.leaveForm.get('endDate')!.value);
      const daysRequested = Math.ceil((requestedEndDate.getTime() - requestedStartDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysRequested > this.remainingLeaves) {
        this.toastr.error("Insufficient Leaves remaining");
        return; 
      }   

      if (daysRequested <0) {
        this.toastr.warning("Please select correct date");
        return; 
      }  
    let token = sessionStorage.getItem('token');
    if(!token){
      token =localStorage.getItem("token");
    }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const leaveRequestData = { ...this.leaveForm.value, leaveStatus: 'pending', DaysRequested: daysRequested };
      this.httpClient.post<any>(`${this.baseUrl}/leave-request`, leaveRequestData,{headers})
        .subscribe(
          response => {
            console.log('Leave request submitted successfully:', response);

            // Assuming getEmployeeByEmail returns an array of employees
            this.employeeService.getEmployeeByEmail(email).subscribe(
              loggedInEmployees => {
                const loggedInEmployee = loggedInEmployees[0];
                if (loggedInEmployee) {
                  if (loggedInEmployee.remainingLeaves >= daysRequested) {
                    loggedInEmployee.remainingLeaves -= daysRequested;
                    this.employeeService.updateEmployeeDetails(loggedInEmployee.empId, loggedInEmployee).subscribe(
                      () => {
                        this.toastr.success('Leave Request sent successfully');
                        this.router.navigate(['/user-details', email]);
                      },
                      (error) => {
                        console.error('Error updating employee details:', error);
                      }
                    );
                  } else {
                    this.toastr.error('Insufficient remaining leaves for the requested period.');
                  }
                }
              },
              error => {
                console.error('Error fetching employee details:', error);
                if(error.status==401){
                  this.router.navigate(["/"])
                }
              }
            );
          },
          error => {
            console.error('Error submitting leave request:', error);
          }
        );
    }
  }
}
