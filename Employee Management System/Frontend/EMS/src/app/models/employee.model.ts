// employee.model.ts

import { Binary } from "@angular/compiler";

export interface Employee {
  data: any;
  id: number;
  name: string;
  empId: string;
  age: number;
  email: string;
  password: string;
  department: string;
  role: string;
  mobile: string;
  addressType: string;
  address: string;
  remainingLeaves: number;
  imageURL: string; 
}


  export interface Leave {
    _id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string;
    DaysRequested:number,
    leaveStatus: string;
  }
  
  

  
  