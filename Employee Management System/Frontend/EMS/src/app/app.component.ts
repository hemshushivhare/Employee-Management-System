import { Component } from '@angular/core';
import { AuthService } from './services/Authservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService ,private router: Router) {}
  isLoggedIn(): boolean {
    const loggedIn = this.authService.isLoggedIn();
    console.log('Is Logged In:', loggedIn);
    return loggedIn;
  }

  shouldRenderHeader(): boolean {
    return this.router.url !== '/';
  }
  
}


