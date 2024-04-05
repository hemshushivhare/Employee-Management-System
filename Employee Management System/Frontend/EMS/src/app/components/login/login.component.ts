import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/Authservice';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  rememberMe: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(response => {
          if (response && response.user) {
            console.log(response);
            const token = response.token;

            // Store token based on rememberMe value
            if (this.rememberMe) {
              localStorage.setItem("token", token);
              sessionStorage.removeItem("token");
            } else {
              sessionStorage.setItem("token", token);
              localStorage.removeItem("token");
            }

            // Handle authentication response
            const email = response.user.email;
            const role = response.user.role;

            // Set isLoggedIn to true upon successful login
            this.authService.setLoggedIn(true);

            if (role === 'Employer') {
              localStorage.setItem("Email", email);
              localStorage.setItem("Role", role);
              this.router.navigate(['/EmployeeList']);
            } else if (role === 'Employee') {
              localStorage.setItem("Email", email);
              localStorage.setItem("Role", role);
              this.toastr.success("Login Successful")
              this.router.navigate(['/user-details', email]);
            } else {
              console.error('Invalid role:', role);
              this.toastr.error("Invalid role");
            }
          } else {
            console.error('Invalid credentials or authentication failed:', response);
           
          }
        }, error => {
          console.error('Error occurred during authentication:', error);
          this.toastr.error('Invalid Credentials');
        });
    } else {
      this.toastr.error("Email & Password is required");
      this.loginForm.markAllAsTouched();
    }
  }

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
    console.log(this.rememberMe)
      
  }
}
