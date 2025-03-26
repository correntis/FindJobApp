import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStateService } from '../../../../../core/services/user-state.service';
import { ResumesService } from '../../../../../core/services/resumes.service';
import { User } from '../../../../../core/models/user.model';
import { Resume } from '../../../../../core/models/resume.model';
import { UsersService } from '../../../../../core/services/users.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
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
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  resume: Resume | null = null;
  userForm!: FormGroup;
  loading = true;
  saving = false;
  editMode = false;
  telegramConnected = false;

  constructor(
    private userStateService: UserStateService,
    private usersService: UsersService,
    private resumesService: ResumesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });
  }

  loadUserData(): void {
    this.loading = true;
    const userId = this.userStateService.authUserValue?.user.id;
    
    if (!userId) {
      this.loading = false;
      return;
    }

    this.usersService.getById(userId).pipe(
      switchMap(user => {
        this.user = user;
        this.updateForm(user);
        
        return this.resumesService.getByUserId(userId).pipe(
          catchError(() => {
            this.resume = null;
            return of(null);
          })
        );
      })
    ).subscribe({
      next: (resume) => {
        this.resume = resume;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateForm(user: User): void {
    if (!this.userForm) return;
    
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    
    this.telegramConnected = !!user.telegram;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.updateForm(this.user!);
    }
  }

  saveUserData(): void {
    if (this.userForm.invalid) return;
    
    this.saving = true;
    const userId = this.userStateService.authUserValue?.user.id;
    
    if (!userId) {
      this.saving = false;
      return;
    }

    const userData = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value
    };

    this.usersService.update(userId, userData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.saving = false;
        this.editMode = false;
        
        const currentAuthUser = this.userStateService.authUserValue;
        if (currentAuthUser) {
          const updatedAuthUser = {
            ...currentAuthUser,
            user: {
              ...currentAuthUser.user,
              ...userData
            }
          };
          this.userStateService.setUser(updatedAuthUser);
        }
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  createResume(): void {
    this.router.navigate(['/profile/resume/create']);
  }

  editResume(): void {
    if (this.resume) {
      this.router.navigate(['/profile/resume/edit', this.resume.id]);
    }
  }
  
  connectTelegram(): void {
    console.log(this.user);
    if (!this.user?.telegramLink) return;
    
    window.open(this.user.telegramLink, '_blank');
    
    alert('Please open the link in Telegram to connect your account. After connecting, refresh this page to see the updated status.');
  }
  
  disconnectTelegram(): void {
    if (!this.user?.id) return;
    
    this.saving = true;
    
    this.usersService.update(this.user.id, { telegram: '' }).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.telegramConnected = false;
        this.saving = false;
        
        const currentAuthUser = this.userStateService.authUserValue;
        if (currentAuthUser) {
          const updatedAuthUser = {
            ...currentAuthUser,
            user: {
              ...currentAuthUser.user,
              telegram: ''
            }
          };
          this.userStateService.setUser(updatedAuthUser);
        }
      },
      error: () => {
        this.saving = false;
        alert('Failed to disconnect Telegram. Please try again.');
      }
    });
  }
  
  openTelegramChat(): void {
    window.open('https://t.me/findjobapp_bot', '_blank');
  }
}
