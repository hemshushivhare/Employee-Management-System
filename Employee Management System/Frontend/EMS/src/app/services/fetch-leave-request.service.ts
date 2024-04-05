// fetch-leave-request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Leave } from 'src/app/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class FetchLeaveRequestService {
  private baseUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  fetchLeaveRequests(pageNumber: number, pageSize: number, searchTerm: string, token: string) {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('search', searchTerm);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.get<{ data: Leave[] }>(`${this.baseUrl}/leave-requests`, { headers, params });
  }
}
