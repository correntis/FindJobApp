import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Application } from '../../../../../core/models/application.model';
import { ApplicationsService } from '../../../../../core/services/applications.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ApplicationStatus } from '../../../../../core/enums/application-status.enum';
import { UsersService } from '../../../../../core/services/users.service';
import { ResumesService } from '../../../../../core/services/resumes.service';
import { User } from '../../../../../core/models/user.model';
import { Resume } from '../../../../../core/models/resume.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { ReplyMessageDialogComponent } from './reply-message-dialog.component';

interface ApplicationWithUserInfo extends Application {
  user?: User;
  hasResume?: boolean;
  resumeId?: string;
}

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
    HeaderComponent,
    RouterModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './applications-list.component.html'
})
export class ApplicationsListComponent implements OnInit {
  applications: ApplicationWithUserInfo[] = [];
  vacancyId: string | null = null;
  isLoading = true;
  displayedColumns: string[] = ['createdAt', 'userName', 'status', 'resume', 'replyMessage', 'actions'];
  applicationStatus = ApplicationStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationsService: ApplicationsService,
    private usersService: UsersService,
    private resumesService: ResumesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.vacancyId = this.route.snapshot.paramMap.get('vacancyId');
    if (this.vacancyId) {
      this.loadApplications(this.vacancyId);
    }
  }

  private loadApplications(vacancyId: string): void {
    this.isLoading = true;
    this.applicationsService.getByVacancyId(vacancyId).pipe(
      switchMap(applications => {
        if (applications.length === 0) {
          return of([]);
        }
        
        const applicationsWithUserInfo$ = applications.map(application => {
          return this.usersService.getById(application.userId).pipe(
            switchMap(user => {
              return this.resumesService.getByUserId(user.id).pipe(
                map(resume => ({
                  ...application,
                  user: user,
                  hasResume: true,
                  resumeId: resume.id
                })),
                catchError(() => {
                  return of({
                    ...application,
                    user: user,
                    hasResume: false
                  });
                })
              );
            }),
            catchError(() => {
              return of({
                ...application
              });
            })
          );
        });
        
        return forkJoin(applicationsWithUserInfo$);
      })
    ).subscribe({
      next: (applicationsWithUserInfo) => {
        this.applications = applicationsWithUserInfo;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
      }
    });
  }

  updateStatus(applicationId: string, status: ApplicationStatus): void {
    const application = this.applications.find(app => app.id === applicationId);
    if (!application) return;

    if (application.status !== ApplicationStatus.Pending) {
      alert('Status can only be changed once');
      return;
    }

    const dialogRef = this.dialog.open(ReplyMessageDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      autoFocus: 'dialog',
      restoreFocus: true,
      data: {
        title: `Reply to ${this.getFullName(application.user)}`,
        message: ''
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(replyMessage => {
      if (replyMessage !== undefined && replyMessage.trim() !== '') {
        this.applicationsService.update(applicationId, { status, replyMessage }).subscribe({
          next: () => {
            this.applications = this.applications.map(app => 
              app.id === applicationId ? { ...app, status, replyMessage } : app
            );
            alert('Application status and reply message updated successfully');
          },
          error: (error) => {
            console.error('Error updating application:', error);
            alert('Failed to update application. Please try again.');
          }
        });
      } else if (replyMessage !== undefined) {
        alert('Reply message cannot be empty');
        this.updateStatus(applicationId, status);
      }
    });
  }

  viewResume(resumeId: string): void {
    this.router.navigate(
      ['/resume', resumeId], 
      { 
        state: { referer: 'applications' },
        queryParams: { vacancyId: this.vacancyId }
      }
    );
  }

  getFullName(user?: User): string {
    if (!user) return 'Unknown User';
    return `${user.firstName} ${user.lastName}`;
  }
} 