import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee.model';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId: string | null = null;
  employee: Employee | undefined;
  editMode: boolean = false;
  addressTypes: string[] = ['Home', 'Office']; 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private toastr:ToastrService
  ) {}
  ngOnInit(): void {
    // Retrieving the employee ID from the route parameters
    this.employeeId = this.route.snapshot.paramMap.get('id');

    if (!this.employeeId) {
      console.error('Employee ID is null or undefined.');
    
      return;
    }

    // Fetching employee details based on the employeeId from the service
    this.employeeService.getEmployeeById(this.employeeId).subscribe(
      (data: Employee | Employee[]) => {
        if (Array.isArray(data)) {
          // If data is an array, take the first element
          this.employee = data[0];
        } else {
          // If data is not an array, assign it directly
          this.employee = data;
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
       
      }
    );
  }

  onEdit(): void {
    this.editMode = true;
  }

  onUpdate(): void {
    if (!this.employeeId || !this.employee) {
      console.error('Invalid employeeId or employee details.');
      return;
    }
  
    this.employeeService.updateEmployeeDetails(this.employeeId, this.employee).subscribe(
      () => {
        this.toastr.success("Details Updated Successfully")
        this.router.navigate(['/EmployeeList']);
      },
      (error) => {
        console.error('Error updating employee details:', error);
      }
    );
  }
  
  onCancelEdit():void{
    this.editMode = false;
  }


  

  onDelete(): void {
    {
      this.employeeService.deleteEmployeeById(this.employeeId!).subscribe(
        () => {
          this.toastr.success("Employee Deleted Successfully")
          this.router.navigate(['/EmployeeList']);
        },
        (error) => {
          console.error('Error deleting employee:', error);
        }
      );
    }
  }

  isDialogOpen: boolean = false;

  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }

}