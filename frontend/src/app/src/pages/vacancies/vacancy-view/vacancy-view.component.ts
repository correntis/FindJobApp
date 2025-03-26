import { UserStateService } from './../../../../../core/services/user-state.service';
// vacancy-view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Vacancy } from '../../../../../core/models/vacancy.model';
import { VacanciesService } from '../../../../../core/services/vacancies.service';
import { ApplicationsService } from '../../../../../core/services/applications.service';
import { User } from '../../../../../core/models/user.model';
import { Application } from '../../../../../core/models/application.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Company } from '../../../../../core/models/company.model';
import { CompaniesService } from '../../../../../core/services/companies.service';
import { HeaderComponent } from "../../../shared/header/header.component";
import { UserRoles } from '../../../../../core/enums/user-roles.enum';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vacancy-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatChipsModule, RouterModule],
  templateUrl: './vacancy-view.component.html',
})
export class VacancyViewComponent implements OnInit {
  vacancy?: Vacancy;
  user?: User;
  application?: Application;
  company?: Company;
  isLoading = true;
  isLoadingApplication = false;
  isCompanyOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vacanciesService: VacanciesService,
    private applicationService: ApplicationsService,
    private companiesService: CompaniesService,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    this.user = this.userStateService.authUserValue?.user;

    this.userStateService.authUser$.subscribe((authUser) => {
      this.user = authUser?.user;
    });

    const vacancyId = this.route.snapshot.paramMap.get('vacancyId');
    if (vacancyId) {
      this.loadVacancy(vacancyId);
      if (this.user?.role === UserRoles.User) {
        this.checkApplicationStatus(vacancyId);
      }
    }
  }

  private loadCompany(id: string): void {
    this.companiesService.getById(id).subscribe({
      next: (company) => {
        this.company = company;
        this.isCompanyOwner = this.user?.role === UserRoles.Company && 
                             this.company?.userId === this.user?.id;
      },
      error: (err) => console.error('Error loading company:', err)
    });
  }

  private loadVacancy(id: string): void {
    this.vacanciesService.getById(id).subscribe({
      next: (vacancy) => {
        this.vacancy = vacancy;
        this.isLoading = false;
        this.loadCompany(vacancy.companyId);
      },
      error: () => (this.isLoading = false),
    });
  }

  private checkApplicationStatus(vacancyId: string): void {
    if (this.user?.id) {
      this.applicationService
        .getByVacancyAndUser(vacancyId, this.user.id)
        .subscribe({
          next: (application) => {
            this.application = application;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
          },
        });
    }
  }

  applyForVacancy(): void {
    if (!this.vacancy || this.isLoadingApplication || 
        this.vacancy.is_archived || this.user?.role !== UserRoles.User) return;

    this.isLoadingApplication = true;

    this.applicationService
      .create({
        vacancyId: this.vacancy.id,
        userId: this.user?.id,
      })
      .subscribe({
        next: (application) => {
          this.application = application;
          this.isLoadingApplication = false;
        },
        error: (err) => {
          console.error('Application failed:', err);
          this.isLoadingApplication = false;
        },
      });
  }

  goToCompany() {
    this.router.navigate(['company', this.company?.id]);
  }

  unarchiveVacancy(): void {
    if (!this.vacancy || !this.isCompanyOwner) {
      alert('Только владелец компании может архивировать/разархивировать вакансии');
      return;
    }
    
    this.vacanciesService.archive(this.vacancy.id).subscribe({
      next: () => {
        if (this.vacancy) {
          this.vacancy.is_archived = false;
        }
        alert('Vacancy has been successfully unarchived');
      },
      error: (err) => {
        console.error('Error unarchiving vacancy:', err);
        if (err.status === 403) {
          alert('Вы не можете разархивировать чужие вакансии');
        } else {
          alert('Failed to unarchive vacancy. Please try again.');
        }
      }
    });
  }

  goToCompanyProfile(): void {
    this.router.navigate(['/profile/company']);
  }
}
