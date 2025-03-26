// company-view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompaniesService } from '../../../../../core/services/companies.service';
import { VacanciesService } from '../../../../../core/services/vacancies.service';
import { Company } from '../../../../../core/models/company.model';
import { Vacancy } from '../../../../../core/models/vacancy.model';
import { HeaderComponent } from "../../../shared/header/header.component";

@Component({
  selector: 'app-company-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterModule,
],
  templateUrl: './company-view.component.html',
})
export class CompanyViewComponent implements OnInit {
  company?: Company;
  vacancies: Vacancy[] = [];
  isLoading = true;
  vacanciesLoading = true;

  constructor(
    private route: ActivatedRoute,
    private companiesService: CompaniesService,
    private vacanciesService: VacanciesService
  ) {}

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    if (companyId) {
      this.loadCompany(companyId);
      this.loadVacancies(companyId);
    }
  }

  private loadCompany(companyId: string): void {
    this.companiesService.getById(companyId).subscribe({
      next: (company) => {
        this.company = company;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private loadVacancies(companyId: string): void {
    this.vacanciesService.getAllByCompanyId(companyId).subscribe({
      next: (vacancies) => {
        this.vacancies = vacancies;
        this.vacanciesLoading = false;
      },
      error: () => {
        this.vacanciesLoading = false;
      },
    });
  }
}
