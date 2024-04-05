import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-SignUp',
  templateUrl: './SignUp.component.html',
})
export class SignUpComponent {
  private baseUrl = 'http://localhost:8080';
  signupForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private httpClient: HttpClient) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/)]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.httpClient.post<any>(`${this.baseUrl}/signup`, this.signupForm.value)
        .pipe(
          catchError(error => {
            console.error('Signup error:', error);
            return of(null); 
          })
        )
        .subscribe(response => {
          if (response) {
            console.log('Signup successful:', response);
            window.alert("Employer Registered Succesfully");
            this.router.navigate(['/EmployeeList']);
          } else {
            console.error('Signup failed.');
          }
        });
    } else {
      // Mark form controls as touched to display validation messages
      this.signupForm.markAllAsTouched();
    }
  }
}
