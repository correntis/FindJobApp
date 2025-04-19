import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Resume } from '../../../../../core/models/resume.model';
import { ResumesService } from '../../../../../core/services/resumes.service';
import { UsersService } from '../../../../../core/services/users.service';
import { User } from '../../../../../core/models/user.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { RouterModule } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-resume-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    HeaderComponent,
    RouterModule
  ],
  templateUrl: './resume-view.component.html'
})
export class ResumeViewComponent implements OnInit {
  resume: Resume | null = null;
  user: User | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resumesService: ResumesService,
    private usersService: UsersService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const resumeId = this.route.snapshot.paramMap.get('resumeId');
    if (resumeId) {
      this.loadResume(resumeId);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadResume(resumeId: string): void {
    this.resumesService.getById(resumeId).pipe(
      switchMap(resume => {
        this.resume = resume;
        return this.usersService.getById(resume.userId);
      }),
      catchError(error => {
        console.error('Error loading resume:', error);
        this.error = true;
        return of(null);
      })
    ).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    try {
      const referer = window.history.state?.referer;
      const vacancyId = this.route.snapshot.queryParams['vacancyId'];
      
      if (referer === 'applications' && vacancyId) {
        this.router.navigate(['/vacancies', vacancyId, 'applications']);
      } else {
        this.location.back();
      }
    } catch (error) {
      this.router.navigate(['/vacancies']);
    }
  }

  getFullName(): string {
    if (!this.user) return 'Unknown User';
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  getFormattedDate(date?: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  getBackButtonText(): string {
    const referer = window.history.state?.referer;
    
    if (referer === 'applications') {
      return 'Back to Applications';
    }
    
    return 'Back';
  }
} 