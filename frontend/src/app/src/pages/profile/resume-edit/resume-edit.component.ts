import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResumesService } from '../../../../../core/services/resumes.service';
import { UserStateService } from '../../../../../core/services/user-state.service';
import { Resume } from '../../../../../core/models/resume.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-resume-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule
  ],
  templateUrl: './resume-edit.component.html',
})
export class ResumeEditComponent implements OnInit {
  resumeForm!: FormGroup;
  loading = false;
  saving = false;
  isCreate = true;
  resumeId: string | null = null;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    private resumesService: ResumesService,
    private userStateService: UserStateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params => {
      if (params['resumeId']) {
        this.resumeId = params['resumeId'];
        this.isCreate = false;
        if (this.resumeId) {
          this.loadResume(this.resumeId);
        }
      }
    });
  }

  initForm(): void {
    this.resumeForm = this.fb.group({
      title: ['', [Validators.required]],
      summary: ['', [Validators.required]],
      educations: this.fb.array([]),
      experiences: this.fb.array([]),
      skills: this.fb.array([]),
      languages: this.fb.array([]),
      tags: this.fb.array([])
    });
  }

  loadResume(resumeId: string): void {
    this.loading = true;
    this.resumesService.getById(resumeId).subscribe({
      next: (resume) => {
        this.updateForm(resume);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Ошибка при загрузке резюме', 'Закрыть', { duration: 3000 });
      }
    });
  }

  updateForm(resume: Resume): void {
    if (!this.resumeForm) return;
    
    this.resumeForm.patchValue({
      title: resume.title,
      summary: resume.summary
    });

    this.clearFormArrays();
    
    if (resume.educations) {
      resume.educations.forEach(education => {
        this.educationsArray.push(this.fb.control(education));
      });
    }

    if (resume.experiences) {
      resume.experiences.forEach(exp => {
        this.experiencesArray.push(this.fb.group({
          jobTitle: [exp.jobTitle, Validators.required],
          years: [exp.years, [Validators.required, Validators.min(0)]]
        }));
      });
    }

    if (resume.skills) {
      resume.skills.forEach(skill => {
        this.skillsArray.push(this.fb.control(skill));
      });
    }

    if (resume.languages) {
      resume.languages.forEach(lang => {
        this.languagesArray.push(this.fb.group({
          name: [lang.name, Validators.required],
          level: [lang.level, Validators.required]
        }));
      });
    }

    if (resume.tags) {
      resume.tags.forEach(tag => {
        this.tagsArray.push(this.fb.control(tag));
      });
    }
  }

  clearFormArrays(): void {
    this.educationsArray.clear();
    this.experiencesArray.clear();
    this.skillsArray.clear();
    this.languagesArray.clear();
    this.tagsArray.clear();
  }

  get educationsArray(): FormArray {
    return this.resumeForm.get('educations') as FormArray;
  }

  get experiencesArray(): FormArray {
    return this.resumeForm.get('experiences') as FormArray;
  }

  get skillsArray(): FormArray {
    return this.resumeForm.get('skills') as FormArray;
  }

  get languagesArray(): FormArray {
    return this.resumeForm.get('languages') as FormArray;
  }

  get tagsArray(): FormArray {
    return this.resumeForm.get('tags') as FormArray;
  }

  addEducation(): void {
    this.educationsArray.push(this.fb.control('', Validators.required));
  }

  removeEducation(index: number): void {
    this.educationsArray.removeAt(index);
  }

  addExperience(): void {
    this.experiencesArray.push(this.fb.group({
      jobTitle: ['', Validators.required],
      years: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeExperience(index: number): void {
    this.experiencesArray.removeAt(index);
  }

  addSkill(event: MatChipInputEvent): void {
    if (!event.value) return;
    
    const value = (event.value || '').trim();
    if (value) {
      this.skillsArray.push(this.fb.control(value));
    }
    event.chipInput!.clear();
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  addLanguage(): void {
    this.languagesArray.push(this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required]
    }));
  }

  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }

  addTag(event: MatChipInputEvent): void {
    if (!event.value) return;
    
    const value = (event.value || '').trim();
    if (value) {
      this.tagsArray.push(this.fb.control(value));
    }
    event.chipInput!.clear();
  }

  removeTag(index: number): void {
    this.tagsArray.removeAt(index);
  }

  saveResume(): void {
    if (this.resumeForm.invalid) {
      this.snackBar.open('Пожалуйста, заполните все обязательные поля', 'Закрыть', { duration: 3000 });
      return;
    }

    this.saving = true;
    const userId = this.userStateService.authUserValue?.user.id;
    
    if (!userId) {
      this.saving = false;
      this.snackBar.open('Необходимо авторизоваться', 'Закрыть', { duration: 3000 });
      return;
    }

    const resumeData: Partial<Resume> = {
      ...this.resumeForm.value,
      userId
    };

    if (this.isCreate) {
      this.resumesService.create(resumeData).subscribe({
        next: () => {
          this.saving = false;
          this.snackBar.open('Резюме успешно создано', 'Закрыть', { duration: 3000 });
          this.router.navigate(['/profile/user']);
        },
        error: (error) => {
          this.saving = false;
          if (error.status === 409) {
            this.snackBar.open('У вас уже есть резюме. Вы можете его отредактировать в профиле.', 'Закрыть', { duration: 5000 });
          } else {
            this.snackBar.open('Ошибка при создании резюме', 'Закрыть', { duration: 3000 });
          }
        }
      });
    } else if (this.resumeId) {
      this.resumesService.update(this.resumeId, resumeData).subscribe({
        next: () => {
          this.saving = false;
          this.snackBar.open('Резюме успешно обновлено', 'Закрыть', { duration: 3000 });
          this.router.navigate(['/profile/user']);
        },
        error: () => {
          this.saving = false;
          this.snackBar.open('Ошибка при обновлении резюме', 'Закрыть', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/profile/user']);
  }
}
