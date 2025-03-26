import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endpoints } from '../../config/api.config';
import { Resume } from '../models/resume.model';

@Injectable({
  providedIn: 'root',
})
export class ResumesService {
  constructor(private readonly httpClient: HttpClient) {}

  create(resume: Partial<Resume>): Observable<Resume> {
    const endpoint = endpoints.resumes.add();
    return this.httpClient.post<Resume>(endpoint, resume);
  }

  update(resumeId: string, updateData: Partial<Resume>): Observable<Resume> {
    const endpoint = endpoints.resumes.updateById(resumeId);
    return this.httpClient.put<Resume>(endpoint, updateData);
  }

  delete(resumeId: string): Observable<void> {
    const endpoint = endpoints.resumes.deleteById(resumeId);
    return this.httpClient.delete<void>(endpoint);
  }

  getById(resumeId: string): Observable<Resume> {
    const endpoint = endpoints.resumes.getById(resumeId);
    return this.httpClient.get<Resume>(endpoint);
  }

  getByUserId(userId: string): Observable<Resume> {
    const endpoint = endpoints.resumes.getByUserId(userId);
    return this.httpClient.get<Resume>(endpoint);
  }
}
