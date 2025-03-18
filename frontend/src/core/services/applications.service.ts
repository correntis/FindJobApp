import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';
import { endpoints } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  constructor(private readonly httpClient: HttpClient) {}

  create(application: Partial<Application>): Observable<Application> {
    const endpoint = endpoints.applications.add();
    return this.httpClient.post<Application>(endpoint, application);
  }

  update(
    applicationId: string,
    updateData: Partial<Application>
  ): Observable<Application> {
    const endpoint = endpoints.applications.updateById(applicationId);
    return this.httpClient.put<Application>(endpoint, updateData);
  }

  getById(applicationId: string): Observable<Application> {
    const endpoint = endpoints.applications.getById(applicationId);
    return this.httpClient.get<Application>(endpoint);
  }

  getByUserId(userId: string): Observable<Application[]> {
    const endpoint = endpoints.applications.getByUserId(userId);
    return this.httpClient.get<Application[]>(endpoint);
  }

  getByVacancyId(vacancyId: string): Observable<Application[]> {
    const endpoint = endpoints.applications.getByVacancyId(vacancyId);
    return this.httpClient.get<Application[]>(endpoint);
  }
}
