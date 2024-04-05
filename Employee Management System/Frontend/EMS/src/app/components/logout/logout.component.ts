// logout.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Authservice';

@Component({
  selector: 'app-logout',
  template: `
    <button class="bg-red-500 text-white px-4 py-2 rounded" (click)="logout()">Logout</button>
  `,
  styles: [],
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    // Clear user information and navigate to the login page
    this.authService.setLoggedIn(false);
    this.authService.setUsername(''); // Clear the username from localStorage
    localStorage.clear(); 

    this.router.navigate(['/']); // Navigate to the login page
    
  }
}
