import { Component, OnInit } from '@angular/core';
import { FetchLeaveRequestService } from 'src/app/services/fetch-leave-request.service';
import { Leave } from 'src/app/models/employee.model';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css']
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests: Leave[] = [];
  isAcceptButtonDisabled: boolean = false;
  isRejectButtonDisabled: boolean = false;
  pageNumber = 1;
  pageSize = 7;
  searchTerm = '';
  EndPage = false;
  private baseUrl = 'http://localhost:8080';
  constructor(private fetchLeaveRequestService: FetchLeaveRequestService, private router: Router ,private employeeService : EmployeeService ,private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests(): void {
    let token: string = sessionStorage.getItem('token')!;
    if (!token) {
      token = localStorage.getItem('token')!;
    }
    this.fetchLeaveRequestService.fetchLeaveRequests(this.pageNumber, this.pageSize, this.searchTerm ,token)
      .subscribe(
        response => {
          this.leaveRequests = response.data;
          if (this.leaveRequests == null || this.leaveRequests?.length < 7) {
            this.EndPage = true;
          } else {
            this.EndPage = false;
          }
          console.log('leave requests', this.leaveRequests);
        },
        error => {
          console.error('Error fetching leave requests:', error);
          if (error.status === 401) {
            this.router.navigate(['/']);
          }
        }
      );
  }

  searchLeaves(term: string): void {
    this.searchTerm = term.trim();
    this.pageNumber = 1;
    this.fetchLeaveRequests();
  }
    
   
  
  onAccept(leaveId: string,employeeId:string) {
    if(!this.isAcceptButtonDisabled && !this.isRejectButtonDisabled){
      this.updateLeaveStatus(leaveId, 'Accepted' , employeeId);
      this.isAcceptButtonDisabled=true;
    }
   
    
  }

  onReject(leaveId: string, employeeId: string) {
    if(!this.isRejectButtonDisabled && !this.isAcceptButtonDisabled){
      this.employeeService.getEmployeeById(employeeId).subscribe(
        employee => {
        
          const remainingLeaves = employee[0].remainingLeaves + this.getLeaveDaysRequested(leaveId);
          
          // Update the remaining leaves in the employee details
          this.updateRemainingLeaves(employeeId, remainingLeaves);
          this.isRejectButtonDisabled = true;
          this.updateLeaveStatus(leaveId,'Rejected',employeeId)
        },
        error => {
          console.error('Error fetching employee details:', error);
        }
      );
    }
   
  }
  
  private getLeaveDaysRequested(leaveId: string): number {

    const leave = this.leaveRequests.find(leave => leave._id === leaveId);
    return leave ? leave.DaysRequested : 0; 
  }
  
  private updateRemainingLeaves(employeeId: string, remainingLeaves: number) {
    // Fetch the existing employee details
    this.employeeService.getEmployeeById(employeeId).subscribe(
      employee => {
       
        const updatedEmployeeData = { ...employee[0], remainingLeaves };
  
       
        this.employeeService.updateEmployeeDetails(employeeId, updatedEmployeeData).subscribe(
          response => {
            console.log(response);
            ; // Refresh leave requests after updating remaining leaves
          },
          error => {
            console.error('Error updating remaining leaves:', error);
          }
        );
      },
      error => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  
  
  private updateLeaveStatus(leaveId: string, status: string , employeeId:string) {
    let token = sessionStorage.getItem('token');
    if(!token){
      token = localStorage.getItem('token')
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.patch(`${this.baseUrl}/update-leave-status/${leaveId}`, { leaveStatus: status , employeeId },{headers})
      .subscribe(
        response => {
          console.log(response);
          this.fetchLeaveRequests();
        },
        error => {
          console.error(`Error updating leave status: ${error}`);
        }
      );
  }

 

  onPrevious(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchLeaveRequests()
      
    }
  }

  onNext(): void {
    this.pageNumber++;
    this.fetchLeaveRequests()
  }

}