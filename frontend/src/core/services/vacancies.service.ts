import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endpoints } from '../../config/api.config';
import { Vacancy } from '../models/vacancy.model';
import { SearchVacancyDto } from '../dto/vacancy/search-vacancy.dto';

@Injectable({
  providedIn: 'root',
})
export class VacanciesService {
  constructor(private readonly httpClient: HttpClient) {}

  create(vacancy: Partial<Vacancy>): Observable<Vacancy> {
    const endpoint = endpoints.vacancies.add();
    return this.httpClient.post<Vacancy>(endpoint, vacancy);
  }

  update(vacancyId: string, updateData: Partial<Vacancy>): Observable<Vacancy> {
    const endpoint = endpoints.vacancies.updateById(vacancyId);
    return this.httpClient.put<Vacancy>(endpoint, updateData);
  }

  archive(vacancyId: string): Observable<void> {
    const endpoint = endpoints.vacancies.archiveById(vacancyId);
    return this.httpClient.put<void>(endpoint, {});
  }

  getById(vacancyId: string): Observable<Vacancy> {
    const endpoint = endpoints.vacancies.getById(vacancyId);
    return this.httpClient.get<Vacancy>(endpoint);
  }

  getAllByCompanyId(companyId: string): Observable<Vacancy[]> {
    const endpoint = endpoints.vacancies.getByCompanyId(companyId);
    return this.httpClient.get<Vacancy[]>(endpoint);
  }

  search(searchDto: Partial<SearchVacancyDto>): Observable<Vacancy[]> {
    const endpoint = endpoints.vacancies.search();
    return this.httpClient.post<Vacancy[]>(endpoint, searchDto);
  }
}
