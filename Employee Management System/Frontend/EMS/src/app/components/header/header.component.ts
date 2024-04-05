// header.component.ts

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
 
})
export class HeaderComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;
  emailpath:string|null=null;

  ngOnInit(): void {
    const email = localStorage.getItem('Email');
    console.log(email);
    this.role = localStorage.getItem('Role');
    console.log(this.role);

    if (email) {
      // Split the email address and take the part before '@'
      this.username = email.split('@')[0];
      this.emailpath=email;
    }
  }
}
