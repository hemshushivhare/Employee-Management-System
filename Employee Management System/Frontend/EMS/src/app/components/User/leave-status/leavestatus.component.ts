import { Component, OnInit } from '@angular/core';
import { Leave } from 'src/app/models/employee.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchLeaveRequestService } from 'src/app/services/fetch-leave-request.service';

@Component({
  selector: 'app-leave-status',
  templateUrl: './leavestatus.component.html',
})
export class LeaveStatusComponent implements OnInit {
  leaveRequests: Leave[] = [];
  employeeId: string | undefined|null;


  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
    private fetchLeaveRequestService:FetchLeaveRequestService,
  ) { }

  pageNumber = 1;
  pageSize = 7;
  searchTerm = this.activatedRoute.snapshot.paramMap.get('id')||"";

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
      },
      error => {
        console.error('Error fetching leave requests:', error);
        if (error.status === 401) {
          this.router.navigate(['/']);
        }
      }
    );
}
}