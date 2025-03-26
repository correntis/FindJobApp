import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserStateService } from '../../../../../core/services/user-state.service';
import { CompaniesService } from '../../../../../core/services/companies.service';
import { Company } from '../../../../../core/models/company.model';
import { UsersService } from '../../../../../core/services/users.service';
import { User } from '../../../../../core/models/user.model';
import { VacanciesService } from '../../../../../core/services/vacancies.service';
import { Vacancy } from '../../../../../core/models/vacancy.model';
import { catchError, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './company-profile.component.html',
})
export class CompanyProfileComponent implements OnInit {
  user: User | null = null;
  company: Company | null = null;
  vacancies: Vacancy[] = [];
  companyForm!: FormGroup;
  loading = true;
  saving = false;
  editMode = false;

  constructor(
    private userStateService: UserStateService,
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private vacanciesService: VacanciesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      industry: ['', Validators.required],
      city: ['', Validators.required],
      street: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      webSite: ['']
    });
  }

  loadData(): void {
    this.loading = true;
    const userId = this.userStateService.authUserValue?.user.id;
    
    if (!userId) {
      this.loading = false;
      return;
    }

    this.usersService.getById(userId).pipe(
      switchMap(user => {
        this.user = user;
        
        return this.companiesService.getByUserId(userId).pipe(
          catchError(() => of(null))
        );
      }),
      switchMap(company => {
        this.company = company;
        
        if (company) {
          this.updateForm(company);
          
          return this.vacanciesService.getAllByCompanyId(company.id).pipe(
            catchError(() => of([]))
          );
        } else {
          return of([]);
        }
      })
    ).subscribe({
      next: (vacancies) => {
        this.vacancies = vacancies;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateForm(company: Company): void {
    if (!this.companyForm) return;
    
    this.companyForm.patchValue({
      name: company.name,
      description: company.description,
      industry: company.industry,
      city: company.city,
      street: company.street,
      phone: company.phone,
      email: company.email,
      webSite: company.webSite
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.company) {
      this.updateForm(this.company);
    }
  }

  saveCompanyData(): void {
    if (this.companyForm.invalid) return;
    
    this.saving = true;
    const userId = this.userStateService.authUserValue?.user.id;
    
    if (!userId) {
      this.saving = false;
      return;
    }

    const companyData = {
      ...this.companyForm.value,
      userId
    };

    if (this.company) {
      this.companiesService.update(this.company.id, companyData).subscribe({
        next: (updatedCompany) => {
          this.company = updatedCompany;
          this.saving = false;
          this.editMode = false;
        },
        error: () => {
          this.saving = false;
        }
      });
    } else {
      this.companiesService.create(companyData).subscribe({
        next: (newCompany) => {
          this.company = newCompany;
          this.saving = false;
          this.editMode = false;
        },
        error: () => {
          this.saving = false;
        }
      });
    }
  }

  createVacancy(): void {
    if (this.company) {
      this.router.navigate(['/vacancies/create']);
    }
  }

  editVacancy(vacancyId: string): void {
    this.router.navigate(['/vacancies/edit', vacancyId]);
  }

  archiveVacancy(vacancyId: string): void {
    const vacancy = this.vacancies.find(v => v.id === vacancyId);
    if (!vacancy) {
      alert('Vacancy not found');
      return;
    }

    if (confirm(`Are you sure you want to ${vacancy.is_archived ? 'unarchive' : 'archive'} this vacancy?`)) {
      this.loading = true;
      
      this.vacanciesService.archive(vacancyId).subscribe({
        next: () => {
          const updatedVacancy = { ...vacancy, is_archived: !vacancy.is_archived };
          
            this.vacancies = this.vacancies.map(v => 
              v.id === vacancyId ? updatedVacancy : v
            );
          
          this.loading = false;
          alert(`Vacancy successfully ${vacancy.is_archived ? 'unarchived' : 'archived'}`);
        },
        error: (error) => {
          console.error('Error archiving vacancy:', error);
          this.loading = false;
          
          if (error.status === 403) {
            alert('Вы не можете архивировать чужие вакансии');
          } else {
            alert(`Failed to ${vacancy.is_archived ? 'unarchive' : 'archive'} vacancy. Please try again.`);
          }
        }
      });
    }
  }
  
  viewVacancy(vacancyId: string): void {
    this.router.navigate(['/vacancy', vacancyId]);
  }

  viewApplications(vacancyId: string): void {
    this.router.navigate(['/vacancies', vacancyId, 'applications']);
  }
}
