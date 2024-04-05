import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  searchTerm: string = '';
  private searchTerms$ = new Subject<string>();
  employees: Employee[] = [];
  role: string | null = null;
  pageNumber = 1;
  pageSize = 6;
  EndPage = false;

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('Role');
    if (this.role == 'Employee') {
      this.router.navigate(['/']);
      return;
    }

    this.searchTerms$
      .pipe(
        debounceTime(500),
        map((term) => {
          this.searchEmployees(term);
        })
      )
      .subscribe();

    this.getEmployees();
  }

  searchEmployees(term: string): void {
    this.searchTerm = term.trim();
    this.pageNumber = 1; // Reset page number when performing a new search
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService
      .getEmployees(this.searchTerm, this.pageNumber, this.pageSize)
      .subscribe(
        (data: Employee[]) => {
         
          
          this.employees = data;
          console.log(this.employees)
          if(this.employees == null || this.employees?.length<6){
            this.EndPage=true;
          }
          else this.EndPage=false;
        },
        (error) => {
          console.error('Error fetching employees:', error);
          if (error.status == 401) {
            this.router.navigate(['/']);
          }
        }
      );
  }

  onAddEmployee(): void {
    this.router.navigate(['/AddEmployee']);
  }

  onLeaveAction(): void {
    this.router.navigate(['/leave-requests']);
  }

  showDetails(employee: Employee): void {
    this.router.navigate(['/employee-details', employee.empId]);
  }

  onPrevious(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getEmployees();
    }
  }

  onNext(): void {
    this.pageNumber++;
    this.getEmployees();
  }
}
