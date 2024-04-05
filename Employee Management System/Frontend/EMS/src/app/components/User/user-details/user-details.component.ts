import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee.model';
import { AuthService } from 'src/app/services/Authservice';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  
})
export class UserDetailsComponent implements OnInit {
  employeeEmail: string | null = null;
  employee: Employee | undefined;
  empId : string | null =null;
  editMode: boolean = false;
  addressTypes: string[] = ['Home', 'Office']; 
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toastr :ToastrService
  ) {}

  ngOnInit(): void {
   
    // Retrieving the employee ID from the route parameters
    this.employeeEmail = this.route.snapshot.paramMap.get('email');
 

    if (!this.employeeEmail) {
      console.error('Employee Email is null or undefined.');
      
      return;
    }

    // Fetching employee details based on the employeeEmail from the service
    this.employeeService.getEmployeeByEmail(this.employeeEmail).subscribe(
      (data: Employee | Employee[]) => {
        if (Array.isArray(data)) {
          // If data is an array, take the first element
          this.employee = data[0];
          console.log(this.employee)
         
        } else {
          // If data is not an array, assign it directly
          this.employee = data;
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
        if(error.status==401){
          this.router.navigate(["/"]);
         }
      }
    );
  }  
 
  onLeaveStatus(id:string): void {
  
  this.router.navigate([`/emp-leavestatus/${id}`])
  }


  onUpdate(): void {
    if (!this.employee?.empId || !this.employee) {
      console.error('Invalid employeeId or employee details.');
    
      return;
    }
  
    this.employeeService.updateEmployeeDetails(this.employee?.empId, this.employee).subscribe(
      () => {
      console.log(this.employeeEmail);
      this.toastr.success("Details Updated Successfully")
      this.editMode=false;
      },
      (error) => {
        console.error('Error updating employee details:', error);
        if(error.status==401){
          this.router.navigate(["/"])
        }
    
      }
    );
  }
  
  onEdit(): void {
    this.editMode = true;
  }

  onCancelEdit(): void {
    this.editMode = false;
  }
  onRequestLeave(): void { 
    this.router.navigate(["/request-leave"], 
      {queryParams : {
        empId : this.employee?.empId || ''
      }});
  }


 
}