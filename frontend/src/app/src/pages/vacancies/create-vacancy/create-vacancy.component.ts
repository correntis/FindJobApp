import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CompaniesService } from '../../../../../core/services/companies.service';
import { UserStateService } from '../../../../../core/services/user-state.service';
import { VacanciesService } from '../../../../../core/services/vacancies.service';
import { Vacancy } from '../../../../../core/models/vacancy.model';
import { Company } from '../../../../../core/models/company.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';

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
    MatSliderModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-vacancy.component.html',
  styleUrl: './create-vacancy.component.css'
})
export class CreateVacancyComponent implements OnInit {
  vacancyForm!: FormGroup;
  company: Company | null = null;
  loading = true;
  saving = false;
  employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  
  constructor(
    private fb: FormBuilder,
    private vacanciesService: VacanciesService,
    private companiesService: CompaniesService,
    private userStateService: UserStateService, 
    private router: Router
  ) { 
    console.log('CreateVacancyComponent constructor called');
  }

  ngOnInit(): void {
    console.log('CreateVacancyComponent ngOnInit called');
    this.initForm();
    this.loadCompanyData();
  }

  initForm(): void {
    this.vacancyForm = this.fb.group({
      title: ['', Validators.required],
      empl_type: ['Full-time', Validators.required],
      requirements: this.fb.array([this.fb.control('', Validators.required)]),
      skills: this.fb.array([this.fb.control('', Validators.required)]),
      tags: this.fb.array([this.fb.control('', Validators.required)]),
      salary: this.fb.group({
        min: [0, [Validators.required, Validators.min(0)]],
        max: [0, [Validators.required, Validators.min(0)]]
      }),
      experience_level: this.fb.group({
        min: [0, [Validators.required, Validators.min(0)]],
        max: [0, [Validators.required, Validators.min(0)]]
      }),
      languages: this.fb.array([])
    });
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
      }
    });
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

  removeRequirement(index: number): void {
    if (this.requirementsArray.length > 1) {
      this.requirementsArray.removeAt(index);
    }
  }

  addSkill(): void {
    this.skillsArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  addTag(): void {
    this.tagsArray.push(this.fb.control('', Validators.required));
  }

  removeTag(index: number): void {
    if (this.tagsArray.length > 1) {
      this.tagsArray.removeAt(index);
    }
  }

  addLanguage(): void {
    this.languagesArray.push(
      this.fb.group({
        name: ['', Validators.required],
        level: ['A1', Validators.required]
      })
    );
  }

  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }

  saveVacancy(): void {
    if (this.vacancyForm.invalid) {
      this.markFormGroupTouched(this.vacancyForm);
      return;
    }
    
    if (!this.company) {
      console.error('No company data available');
      alert('Company information is missing. Please go back to company profile.');
      return;
    }
    
    this.saving = true;
    const vacancyData: Partial<Vacancy> = {
      ...this.vacancyForm.value,
      companyId: this.company.id,
      is_archived: false,
      created_at: new Date()
    };
    
    console.log('Sending vacancy data:', vacancyData);

    this.vacanciesService.create(vacancyData).subscribe({
      next: (createdVacancy) => {
        console.log('Vacancy created successfully:', createdVacancy);
        this.saving = false;
        alert('Vacancy created successfully!');
        this.router.navigate(['/profile/company']);
      },
      error: (error) => {
        console.error('Error creating vacancy:', error);
        this.saving = false;
        alert(`Failed to create vacancy: ${error.message || 'Unknown error'}`);
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile/company']);
  }
} 