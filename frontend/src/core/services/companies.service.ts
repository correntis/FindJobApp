import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endpoints } from '../../config/api.config';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  constructor(private readonly httpClient: HttpClient) {}

  create(company: Partial<Company>): Observable<Company> {
    const endpoint = endpoints.companies.add();
    return this.httpClient.post<Company>(endpoint, company);
  }

  update(companyId: string, updateData: Partial<Company>): Observable<Company> {
    const endpoint = endpoints.companies.updateById(companyId);
    return this.httpClient.put<Company>(endpoint, updateData);
  }

  getById(companyId: string): Observable<Company> {
    const endpoint = endpoints.companies.getById(companyId);
    return this.httpClient.get<Company>(endpoint);
  }
}
