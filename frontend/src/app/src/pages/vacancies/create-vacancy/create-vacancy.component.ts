import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { CompaniesService } from '../../../../../core/services/companies.service';
import { UserStateService } from '../../../../../core/services/user-state.service';
import { VacanciesService } from '../../../../../core/services/vacancies.service';
import { Vacancy } from '../../../../../core/models/vacancy.model';
import { Company } from '../../../../../core/models/company.model';

@Component({
  selector: 'app-create-vacancy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-vacancy.component.html',
  styleUrl: './create-vacancy.component.css',
})
export class CreateVacancyComponent implements OnInit {
  vacancyForm: FormGroup;
  company: Company | null = null;
  loading = true;
  saving = false;
  employmentTypes = [
    'Полное',
    'Пол ставки',
    'Контракт',
    'Стажировка',
    'Удаленно',
  ];
  isEditMode = false;
  vacancyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vacanciesService: VacanciesService,
    private companiesService: CompaniesService,
    private userStateService: UserStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.vacancyForm = this.fb.group({
      title: ['', Validators.required],
      empl_type: ['Full-time', Validators.required],
      requirements: this.fb.array([]),
      skills: this.fb.array([]),
      tags: this.fb.array([]),
      min_age: [null],
      for_invalids: [false],
      salary: this.fb.group({
        min: [0, [Validators.required, Validators.min(0)]],
        max: [0, [Validators.required, Validators.min(0)]],
      }),
      experience_level: this.fb.group({
        min: [0, [Validators.required, Validators.min(0)]],
        max: [0, [Validators.required, Validators.min(0)]],
      }),
      languages: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadCompanyData();

    this.vacancyId = this.route.snapshot.paramMap.get('vacancyId');
    if (this.vacancyId) {
      this.isEditMode = true;
      this.loadVacancyData(this.vacancyId);
    }
  }

  private loadVacancyData(vacancyId: string): void {
    this.loading = true;
    this.vacanciesService.getById(vacancyId).subscribe({
      next: (vacancy) => {
        this.patchFormWithVacancy(vacancy);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vacancy:', error);
        this.loading = false;
        alert('Failed to load vacancy data. Please try again.');
      },
    });
  }

  private patchFormWithVacancy(vacancy: Vacancy) {
    this.clearFormArrays();

    this.vacancyForm.patchValue({
      title: vacancy.title,
      empl_type: vacancy.empl_type,
      salary: {
        min: vacancy.salary?.min || 0,
        max: vacancy.salary?.max || 0,
      },
      experience_level: {
        min: vacancy.experience_level?.min || 0,
        max: vacancy.experience_level?.max || 0,
      },
      for_invalids: vacancy?.for_invalids,
      min_age: vacancy?.min_age,
    });

    if (vacancy.requirements) {
      vacancy.requirements.forEach((req) => {
        this.requirementsArray.push(this.fb.control(req));
      });
    }

    if (vacancy.skills) {
      vacancy.skills.forEach((skill) => {
        this.skillsArray.push(this.fb.control(skill));
      });
    }

    if (vacancy.tags) {
      vacancy.tags.forEach((tag) => {
        this.tagsArray.push(this.fb.control(tag));
      });
    }

    if (vacancy.languages) {
      vacancy.languages.forEach((lang) => {
        const languageGroup = this.fb.group({
          name: [lang.name, Validators.required],
          level: [lang.level, Validators.required],
        });
        this.languagesArray.push(languageGroup);
      });
    }
  }

  private clearFormArrays(): void {
    this.requirementsArray.clear();
    this.skillsArray.clear();
    this.tagsArray.clear();
    this.languagesArray.clear();
  }

  get requirementsArray(): FormArray {
    return this.vacancyForm.get('requirements') as FormArray;
  }

  get skillsArray(): FormArray {
    return this.vacancyForm.get('skills') as FormArray;
  }

  get tagsArray(): FormArray {
    return this.vacancyForm.get('tags') as FormArray;
  }

  get languagesArray(): FormArray {
    return this.vacancyForm.get('languages') as FormArray;
  }

  addRequirement(): void {
    this.requirementsArray.push(this.fb.control('', Validators.required));
  }

  addSkill(): void {
    this.skillsArray.push(this.fb.control('', Validators.required));
  }

  addTag(): void {
    this.tagsArray.push(this.fb.control('', Validators.required));
  }

  addLanguage(): void {
    this.languagesArray.push(
      this.fb.group({
        name: ['', Validators.required],
        level: ['', Validators.required],
      })
    );
  }

  removeRequirement(index: number): void {
    if (this.requirementsArray.length > 1) {
      this.requirementsArray.removeAt(index);
    }
  }

  removeSkill(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  removeTag(index: number): void {
    if (this.tagsArray.length > 1) {
      this.tagsArray.removeAt(index);
    }
  }

  removeLanguage(index: number): void {
    if (this.languagesArray.length > 1) {
      this.languagesArray.removeAt(index);
    }
  }

  loadCompanyData(): void {
    this.loading = true;
    const userId = this.userStateService.authUserValue?.user.id;

    if (!userId) {
      this.loading = false;
      this.router.navigate(['/profile/company']);
      return;
    }

    this.companiesService.getByUserId(userId).subscribe({
      next: (company) => {
        this.company = company;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/profile/company']);
      },
    });
  }

  saveVacancy(): void {
    if (this.vacancyForm.invalid) {
      this.markFormGroupTouched(this.vacancyForm);
      return;
    }

    if (!this.company) {
      console.error('No company data available');
      alert(
        'Company information is missing. Please go back to company profile.'
      );
      return;
    }

    this.saving = true;

    const formValue = this.vacancyForm.value;
    const vacancyData: Partial<Vacancy> = {
      ...formValue,
      companyId: this.company.id,
      is_archived: false,
      created_at: new Date(),
    };

    const operation =
      this.isEditMode && this.vacancyId
        ? this.vacanciesService.update(this.vacancyId, vacancyData)
        : this.vacanciesService.create(vacancyData);

    operation.subscribe({
      next: (vacancy) => {
        this.saving = false;
        alert(
          `Vacancy ${this.isEditMode ? 'updated' : 'created'} successfully!`
        );
        this.router.navigate(['/profile/company']);
      },
      error: (error) => {
        console.error('Error saving vacancy:', error);
        this.saving = false;
        alert(
          `Failed to ${this.isEditMode ? 'update' : 'create'} vacancy: ${
            error.message || 'Unknown error'
          }`
        );
      },
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile/company']);
  }
}
