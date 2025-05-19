import {
  Component,
  HostListener,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VacanciesService } from '../../../../../core/services/vacancies.service';
import { Vacancy } from '../../../../../core/models/vacancy.model';
import { CommonModule } from '@angular/common';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CompactVacancyComponent } from '../../../shared/compact-vacancy/compact-vacancy.component';
import { UserStateService } from '../../../../../core/services/user-state.service';
import { ApplicationsService } from '../../../../../core/services/applications.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { User } from '../../../../../core/models/user.model';
import { UserRoles } from '../../../../../core/enums/user-roles.enum';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    CompactVacancyComponent,
  ],
})
export class VacanciesPageComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  languages: string[] = [];
  vacancies: Vacancy[] = [];
  loading = false;
  currentPage = 1;
  currentLimit = 5;
  hasMore = true;
  employmentTypes = [
    'Полное',
    'Пол ставки',
    'Контракт',
    'Стажировка',
    'Удаленно',
  ];
  currentUser: User | null = null;
  showArchivedOption = false;
  userApplications: string[] = [];

  @ViewChild('languageInput') languageInput!: ElementRef<HTMLInputElement>;
  languageCtrl = new FormControl('');
  filteredLanguages: string[] = [];

  @ViewChild('filtersContainer') filtersContainer?: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vacancyService: VacanciesService,
    private userStateService: UserStateService,
    private applicationsService: ApplicationsService
  ) {
    this.form = this.fb.group({
      title: [''],
      minSalary: [null],
      maxSalary: [null],
      minExperience: [null],
      maxExperience: [null],
      empl_type: [''],
      skills: new FormControl([]),
      languages: new FormControl([]),
      tags: new FormControl([]),
      for_invalids: [false],
      min_age: [null],
    });
  }

  ngOnInit() {
    this.loadLanguages();

    this.userStateService.authUser$.subscribe((authUser) => {
      this.currentUser = authUser?.user || null;

      this.showArchivedOption = this.currentUser?.role === UserRoles.Company;

      if (this.currentUser?.role === UserRoles.User && this.currentUser?.id) {
        this.loadUserApplications(this.currentUser.id);
      } else {
        this.resetAndLoad();
      }
    });

    this.form.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.resetAndLoad();
      });
  }

  loadLanguages() {
    this.vacancyService.getAllLanguages().subscribe((languages) => {
      this.languages = languages;
      this.filteredLanguages = [...this.languages];

      this.languageCtrl.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe((val) => {
          const filter = (val || '').toLowerCase();
          this.filteredLanguages = this.languages.filter(
            (l) =>
              l.toLowerCase().includes(filter) &&
              !(this.form.controls['languages'].value as string[]).includes(l)
          );
        });
    });
  }

  loadUserApplications(userId: string) {
    this.applicationsService
      .getByUserId(userId)
      .pipe(
        map((applications) => applications.map((app) => app.vacancyId)),
        catchError(() => of([]))
      )
      .subscribe({
        next: (vacancyIds) => {
          this.userApplications = vacancyIds;
          this.resetAndLoad();
        },
        error: () => {
          this.resetAndLoad();
        },
      });
  }

  ngAfterViewInit() {
    this.setupFiltersScroll();
  }

  setupFiltersScroll() {
    setTimeout(() => {
      const filterElements = document.querySelectorAll(
        '.filters-scroll-container'
      );
      if (filterElements && filterElements.length > 0) {
        filterElements.forEach((container) => {
          container.addEventListener(
            'wheel',
            (event: any) => {
              const el = container as HTMLElement;
              const scrollTop = el.scrollTop;
              const scrollHeight = el.scrollHeight;
              const height = el.clientHeight;
              const delta = event.deltaY;

              if (
                (scrollTop <= 0 && delta < 0) ||
                (scrollTop + height >= scrollHeight && delta > 0)
              ) {
              } else {
                event.preventDefault();
                el.scrollTop = scrollTop + delta;
              }
            },
            { passive: false }
          );
        });
      }
    }, 500);
  }

  resetAndLoad() {
    this.currentPage = 1;
    this.hasMore = true;
    this.vacancies = [];
    this.searchVacancies();
  }

  searchVacancies() {
    if (this.loading) return;

    const params = { ...this.form.value };

    if (this.currentUser?.role !== UserRoles.Company && !params.is_archived) {
      params.is_archived = false;
    }

    this.loading = true;
    this.vacancyService
      .search({
        ...params,
        limit: this.currentLimit,
        page: this.currentPage,
      })
      .subscribe({
        next: (res) => {
          let filteredVacancies = res;

          if (params.is_archived && this.currentUser?.role === UserRoles.User) {
            filteredVacancies = res.filter(
              (vacancy) =>
                !vacancy.is_archived ||
                this.userApplications.includes(vacancy.id)
            );
          }

          if (this.vacancies.length > 0) {
            setTimeout(() => {
              this.vacancies = [...this.vacancies, ...filteredVacancies];
              this.loading = false;
            }, 300);
          } else {
            this.vacancies = filteredVacancies;
            this.loading = false;
          }

          if (res.length < this.currentLimit) {
            this.hasMore = false;
          }

          this.currentPage++;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.hasMore || this.loading) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop + windowHeight > documentHeight * 0.8) {
      this.searchVacancies();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.setupFiltersScroll();
  }

  addSkill(event: any) {
    const value = (event.value || '').trim();
    if (value) {
      this.form.controls['skills'].setValue([
        ...this.form.controls['skills'].value,
        value,
      ]);
      event.chipInput!.clear();
    }
  }

  removeSkill(skill: string) {
    const skills = this.form.controls['skills'].value.filter(
      (s: string) => s !== skill
    );
    this.form.controls['skills'].setValue(skills);
  }

 addLanguageFromInput(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (
      value &&
      this.languages.includes(value) &&
      !(this.form.controls['languages'].value as string[]).includes(value)
    ) {
      this.form.controls['languages'].setValue([
        ...this.form.controls['languages'].value,
        value,
      ]);
      this.resetAndLoad();
    }

    event.chipInput!.clear();
    this.languageCtrl.setValue('');
  }

  addLanguageFromAutocomplete(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value as string;

    if (
      value &&
      this.languages.includes(value) &&
      !(this.form.controls['languages'].value as string[]).includes(value)
    ) {
      this.form.controls['languages'].setValue([
        ...this.form.controls['languages'].value,
        value,
      ]);
      this.resetAndLoad();
    }

    this.languageInput.nativeElement.value = '';
    this.languageCtrl.setValue('');
  }

  removeLanguage(language: string) {
    const languages = this.form.controls['languages'].value.filter(
      (s: string) => s !== language
    );
    this.form.controls['languages'].setValue(languages);
  }

  redirectToVacancyPage(vacancy: Vacancy) {
    this.router.navigate(['vacancy', vacancy.id]);
  }
}
