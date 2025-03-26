import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { Application } from '../../../../../core/models/application.model';
import { ApplicationsService } from '../../../../../core/services/applications.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ApplicationStatus } from '../../../../../core/enums/application-status.enum';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
  ],
  templateUrl: './applications-list.component.html'
})
export class ApplicationsListComponent implements OnInit {
  applications: Application[] = [];
  vacancyId: string | null = null;
  isLoading = true;
  displayedColumns: string[] = ['createdAt', 'userName', 'status', 'actions'];
  applicationStatus = ApplicationStatus;

  constructor(
    private route: ActivatedRoute,
    private applicationsService: ApplicationsService
  ) {}

  ngOnInit(): void {
    this.vacancyId = this.route.snapshot.paramMap.get('vacancyId');
    if (this.vacancyId) {
      this.loadApplications(this.vacancyId);
    }
  }

  private loadApplications(vacancyId: string): void {
    this.isLoading = true;
    this.applicationsService.getByVacancyId(vacancyId).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
      }
    });
  }

  updateStatus(applicationId: string, status: ApplicationStatus): void {
    this.applicationsService.update(applicationId, { status }).subscribe({
      next: (updatedApplication) => {
        this.applications = this.applications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        );
        alert('Application status updated successfully');
      },
      error: (error) => {
        console.error('Error updating application status:', error);
        alert('Failed to update application status. Please try again.');
      }
    });
  }
} 