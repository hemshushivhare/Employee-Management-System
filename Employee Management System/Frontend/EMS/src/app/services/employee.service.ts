import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  
  getEmployees(searchTerm: string, pageNumber: number, pageSize: number): Observable<Employee[]> {
    let token = sessionStorage.getItem('token');
    if (!token) {
      token = localStorage.getItem('token');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get<{ data: Employee[] }>(`${this.baseUrl}/get-employee-details`, { headers, params })
      .pipe(map((response: { data: Employee[] }) => response.data));
  }

  getEmployeeById(id: string): Observable<Employee[]> {
    

    let token = sessionStorage.getItem('token');
    if(!token){
     token = localStorage.getItem('token');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<{data:Employee[]}>(`${this.baseUrl}/get-employee-details/${id}`,{headers})
    .pipe(map((response: { data: any; }) => response.data));
  }

   
  getEmployeeByEmail(email: string): Observable<Employee[]> {
    let token = sessionStorage.getItem('token');
    console.log(token);
    
    if(!token){
     token = localStorage.getItem('token');
     console.log(token);
     
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<{data:Employee[]}>(`${this.baseUrl}/get-employee-by-email/${email}`,{headers})
    .pipe(map((response: { data: any; }) => response.data));
  }

  deleteEmployeeById(id: string): Observable<any> {
    let token = sessionStorage.getItem('token');
    if(!token){
     token = localStorage.getItem('token');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.delete<void>(`${this.baseUrl}/delete-employee-details/${id}`,{headers});
  }

  // Add the addEmployee method
  
  addEmployee(employeeData: any, imageFile: File): Observable<any> {
    let token = sessionStorage.getItem('token');
    if (!token) {
      token = localStorage.getItem('token');
    }

    // Create FormData object to append employee data and image file
    const formData = new FormData();
    console.log(employeeData.name);
    
      // Append other form data
      formData.append('name', employeeData.get('name')?.value);
      formData.append('email', employeeData.get('email')?.value);
      formData.append('empId', employeeData.get('empId')?.value);
      formData.append('age', employeeData.get('age')?.value);
      formData.append('password',employeeData.get('password')?.value);
      formData.append('department',employeeData.get('department')?.value);
      formData.append('role', employeeData.get('role')?.value);
      formData.append('mobile', employeeData.get('mobile')?.value);
      formData.append('addressType', employeeData.get('addressType')?.value);
      formData.append('address', employeeData.get('address')?.value);
      formData.append('image', imageFile);


    // Set Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Send POST request with FormData
    return this.httpClient.post<any>(
      `${this.baseUrl}/add-employee`,
      formData,
      { headers }
    );
  }


 
  
  updateEmployeeDetails(id:string , updatedData: any): Observable<any> {
    let token = sessionStorage.getItem('token');
    if(!token){
     token = localStorage.getItem('token');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const url = `${this.baseUrl}/update-employee-details/${id}`;
      return this.httpClient.put(url, updatedData ,{headers});
    }
}