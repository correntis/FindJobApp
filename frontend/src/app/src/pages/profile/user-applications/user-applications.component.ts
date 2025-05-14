import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Application } from '../../../../../core/models/application.model';
import { ApplicationsService } from '../../../../../core/services/applications.service';
import { VacanciesService } from '../../../../../core/services/vacancies.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ApplicationStatus } from '../../../../../core/enums/application-status.enum';
import { UserStateService } from '../../../../../core/services/user-state.service';
import { Vacancy } from '../../../../../core/models/vacancy.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface ApplicationWithVacancyInfo extends Application {
  vacancy?: Vacancy;
}

@Component({
  selector: 'app-user-applications',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    HeaderComponent,
    RouterModule,
    MatTooltipModule
  ],
  template: `
    <div class="responsive-container py-6">
      <div class="custom-card">
        <div class="custom-card-header">
          <h1 class="custom-card-title text-2xl">Мои отклики</h1>
        </div>
        
        <div class="custom-card-content">
          <div *ngIf="isLoading" class="flex justify-center py-8">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div *ngIf="!isLoading && applications.length === 0" class="text-center py-8">
            <div class="text-gray-500">У вас пока нет откликов</div>
          </div>

          <table *ngIf="!isLoading && applications.length > 0" mat-table [dataSource]="applications" class="w-full">
            <!-- Date Column -->
            <ng-container matColumnDef="appliedAt">
              <th mat-header-cell *matHeaderCellDef>Дата отклика</th>
              <td mat-cell *matCellDef="let application">
                {{application.appliedAt | date:'dd.MM.yyyy'}}
              </td>
            </ng-container>

            <!-- Vacancy Column -->
            <ng-container matColumnDef="vacancy">
              <th mat-header-cell *matHeaderCellDef>Вакансия</th>
              <td mat-cell *matCellDef="let application">
                <a [routerLink]="['/vacancy', application.vacancyId]" class="text-primary-600 hover:text-primary-700">
                  {{application.vacancy?.title}}
                </a>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Статус</th>
              <td mat-cell *matCellDef="let application">
                <span [ngClass]="{
                  'text-yellow-600': application.status === applicationStatus.Pending,
                  'text-green-600': application.status === applicationStatus.Applied,
                  'text-red-600': application.status === applicationStatus.Rejected
                }">
                  {{getStatusText(application.status)}}
                </span>
              </td>
            </ng-container>

            <!-- Reply Message Column -->
            <ng-container matColumnDef="replyMessage">
              <th mat-header-cell *matHeaderCellDef>Ответ работодателя</th>
              <td mat-cell *matCellDef="let application">
                <span *ngIf="application.replyMessage" [matTooltip]="application.replyMessage">
                  {{application.replyMessage | slice:0:50}}{{application.replyMessage.length > 50 ? '...' : ''}}
                </span>
                <span *ngIf="!application.replyMessage" class="text-gray-500">
                  Нет ответа
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-card {
      @apply bg-white rounded-lg shadow-sm border border-gray-200;
    }
    
    .custom-card-header {
      @apply px-6 py-4 border-b border-gray-200;
    }
    
    .custom-card-content {
      @apply p-6;
    }
    
    .custom-card-title {
      @apply text-gray-800 font-medium;
    }

    :host ::ng-deep {
      table {
        width: 100%;
      }

      .mat-mdc-row:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .mat-mdc-header-cell {
        @apply font-medium text-gray-700;
      }

      .mat-mdc-cell {
        @apply text-gray-800;
      }
    }
  `]
})
export class UserApplicationsComponent implements OnInit {
  applications: ApplicationWithVacancyInfo[] = [];
  isLoading = true;
  displayedColumns: string[] = ['appliedAt', 'vacancy', 'status', 'replyMessage'];
  applicationStatus = ApplicationStatus;

  constructor(
    private applicationsService: ApplicationsService,
    private vacanciesService: VacanciesService,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userStateService.authUserValue?.user;
    if (currentUser) {
      this.loadApplications(currentUser.id);
    }
  }

  private loadApplications(userId: string): void {
    this.isLoading = true;

    this.applicationsService.getByUserId(userId).pipe(
      switchMap(applications => {
        if (applications.length === 0) {
          return of([]);
        }

        const vacancyRequests = applications.map(application =>
          this.vacanciesService.getById(application.vacancyId).pipe(
            map(vacancy => ({
              ...application,
              vacancy
            })),
            catchError(() => of({ ...application }))
          )
        );

        return forkJoin(vacancyRequests);
      })
    ).subscribe({
      next: (applicationsWithVacancyInfo) => {
        this.applications = applicationsWithVacancyInfo;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusText(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Pending:
        return 'В ожидании';
      case ApplicationStatus.Applied:
        return 'Принят';
      case ApplicationStatus.Rejected:
        return 'Отклонён';
      default:
        return 'Неизвестно';
    }
  }
} 