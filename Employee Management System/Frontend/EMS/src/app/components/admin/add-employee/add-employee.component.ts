import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  private baseUrl = 'http://localhost:8080';
  employeeForm: FormGroup;
  selectedImage!: File;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private httpclient:HttpClient,
    private router: Router,
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      empId: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      mobile: ['', Validators.required],
      department: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/)]],
      role: ['', Validators.required],
      address: ['', Validators.required],
      addressType: ['', Validators.required],
     
    
    });
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.selectedImage = inputElement.files[0];
      // Set the selected image to the form control
      this.employeeForm.patchValue({
        image: this.selectedImage
      });
    } else {
      console.error("No file selected.");
    }
  } 
  
  onAddEmployee() {
    console.log(this.employeeForm);
    
   console.log( this.selectedImage);
   if (this.employeeForm.valid && this.selectedImage) {
    this.employeeService.addEmployee(this.employeeForm, this.selectedImage)
      .subscribe(
        (response) => {
          console.log('Employee Added:', response);
          this.toastr.success("Employee Added Successfully");
          
         
  
          const registrationData = {
            email: this.employeeForm.get('email')?.value,
            password: this.employeeForm.get('password')?.value,
            role: 'Employee', 
          };
  
          this.httpclient.post<any>(`${this.baseUrl}/signup`, registrationData).subscribe(
            (registrationResponse) => {
              console.log('Employee Registered:', registrationResponse);
  
              // Navigate to the employee list or any other page as needed
              this.router.navigate(['/EmployeeList']);
            },
            (error) => {
              console.error('Error registering employee:', error);
            }
          );
          // Reset form and navigate to employee list
        },
        (error) => {
          console.error('Error adding employee:', error);
          // Handle error
        }
      );
  } else {
    // Form is invalid or image is not selected
    this.toastr.error("Fill all the required fields and select an image");
    console.log('Form is invalid or image is not selected.');
  }
}
}