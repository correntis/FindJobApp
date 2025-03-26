import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../../../../../core/services/auth.service';
import { User } from '../../../../../core/models/user.model';
import { LoginUserDto } from '../../../../../core/dto/auth/login-user.dto';
import { AuthUser } from '../../../../../core/models/auth-user.model';
import { RegisterUserDto } from '../../../../../core/dto/auth/register-user.dto';
import { UserStateService } from '../../../../../core/services/user-state.service';
import { constants } from '../../../../../config/constsntas';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  MatError,
  MatFormFieldModule,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Faker } from '../../../../../core/services/faker.services';
import { Observable } from 'rxjs';
import { CreateCompanyDto } from '../../../../../core/dto/company/create-company.dto';
import { UserRoles } from '../../../../../core/enums/user-roles.enum';
import { CompaniesService } from '../../../../../core/services/companies.service';
import { Company } from '../../../../../core/models/company.model';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {
  private userKey = constants.localStorageKeys.user;

  registrationForm: FormGroup;
  companyForm: FormGroup;
  loginForm: FormGroup;

  isLogin = true;
  hidePassword = true;
  hideConfirmPassword = true;

  step = 1;

  appRoles: { text: string; roleName: string }[] = [
    {
      text: '🚀 I\'m seeking exciting career opportunities.',
      roleName: UserRoles.User,
    },
    {
      text: '🏢 I\'m looking to hire exceptional talent for my company.',
      roleName: UserRoles.Company,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private userStateService: UserStateService,
    private localStorageService: LocalStorageService,
    private companiesService: CompaniesService
  ) {
    this.loginForm = this.fb.group({
      email: ['user@example.com', [Validators.required, Validators.email]],
      password: [
        Faker.generateValidPassword(),
        [
          Validators.required,
          Validators.minLength(6),
          // Validators.pattern(
          //   /^(?=.*[A-Z])(?=.*\d)(?=.*[!%&])[A-Za-z\d!%&]{6,}$/
          // ),
        ],
      ],
    });

    this.registrationForm = this.fb.group({
      firstName: [Faker.generateRandomString(), Validators.required],
      lastName: [Faker.generateRandomString(), Validators.required],
      email: [
        // Faker.generateRandomEmail(),
        'user@example.com',
        [(Validators.required, Validators.email)],
      ],
      password: [
        Faker.generateValidPassword(),
        [
          Validators.required,
          Validators.minLength(6),
          // Validators.pattern(
          //   /^(?=.*[A-Z])(?=.*\d)(?=.*[!%&])[A-Za-z\d!%&]{6,}$/
          // ),
        ],
      ],
      confirmPassword: [
        Faker.generateValidPassword(),
        [Validators.required, this.confirmPasswordValidator.bind(this)],
      ],
      choosedRole: ['', Validators.required],
    });

    this.companyForm = this.fb.group({
      companyName: [Faker.generateRandomString(), Validators.required],
      companyIndustry: [Faker.generateRandomString(), Validators.required],
      companyEmail: [Faker.generateRandomEmail(), Validators.email],
      companyPhone: ['', [Validators.pattern(/^\d{10}$/)]],
      companyCity: [''],
      companyDescription: [''],
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginUserDto: LoginUserDto = this.loginForm.value;

    this.authService.login(loginUserDto).subscribe({
      next: (authUser: AuthUser) => {
        this.addAuthUserInLocalStorage(authUser);
        this.router.navigate(['vacancies']);
      },
      error: (err: HttpErrorResponse) => {
        switch (err.status) {
          case HttpStatusCode.BadRequest:
            this.processPasswordInvalidLogin();
            break;

          case HttpStatusCode.NotFound:
            this.processEmailNotFoundLogin();
            break;
        }
      },
    });
  }

  processPasswordInvalidLogin() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl) {
      passwordControl.setErrors({ invalidPassword: true });
    }
  }

  processEmailNotFoundLogin() {
    const emailControl = this.loginForm.get('email');
    if (emailControl) {
      emailControl.setErrors({ emailNotFound: true });
    }
  }

  register() {
    if (!this.registrationForm.valid) {
      alert('Please fill out the form correctly');
      return;
    }

    const { choosedRole } = this.registrationForm.value;

    switch (choosedRole) {
      case UserRoles.User:
        {
          this.performUserRegistration().subscribe({
            next: (authUser: AuthUser) => {
              this.changeAuthUserInLocalStorage(authUser);
              this.router.navigate(['/vacancies']);
            },
            error: (err: HttpErrorResponse) => {
              if (err.status === HttpStatusCode.Conflict) {
                this.processEmailConflict();
              }
            },
          });
        }
        break;
      case UserRoles.Company:
        {
          if (this.step === 1) {
            this.step = 2;
            break;
          }
          this.backToFirstStep();

          this.performUserRegistration().subscribe({
            next: (authUser: AuthUser) => {
              this.changeAuthUserInLocalStorage(authUser);
              this.performCompanyRegistration(authUser.user.id).subscribe({
                next: () => {
                  this.router.navigate(['/home']);
                },
                error: (err) => console.error(err),
              });
            },
            error: (err: HttpErrorResponse) => {
              if (err.status === HttpStatusCode.Conflict) {
                this.processEmailConflict();
              }
            },
          });
        }
        break;
    }
  }

  processEmailConflict() {
    const emailControl = this.registrationForm.get('email');
    if (emailControl) {
      emailControl.setErrors({ existingEmail: true });
      emailControl.markAllAsTouched();
      this.cdr.detectChanges();
    }
  }

  confirmPasswordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = this.registrationForm?.get('password')?.value;
    const confirmPassword = control.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { mustMatch: true };
    }
    return null;
  }

  backToFirstStep() {
    this.step = 1;
  }

  performUserRegistration(): Observable<AuthUser> {
    const { choosedRole, firstName, lastName, email, password } =
      this.registrationForm.value;

    const registrationRequest: RegisterUserDto = {
      firstName,
      lastName,
      email,
      password,
      role: choosedRole,
    };

    return this.authService.register(registrationRequest);
  }

  performCompanyRegistration(userId: string): Observable<Company> {
    const {
      companyName,
      companyIndustry,
      companyPhone,
      companyEmail,
      companyDescription,
      companyCity,
    } = this.companyForm.value;

    const addCompanyRequest: CreateCompanyDto = {
      userId: userId,
      name: companyName,
      industry: companyIndustry,
      phone: companyPhone,
      email: companyEmail,
      description: companyDescription,
      city: companyCity,
    };

    return this.companiesService.create(addCompanyRequest);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  addAuthUserInLocalStorage(authUser: AuthUser) {
    this.localStorageService.setItem(this.userKey, authUser);
    this.userStateService.setUser(authUser);
  }

  changeAuthUserInLocalStorage(authUser: AuthUser) {
    const storedUser = this.localStorageService.getItem<AuthUser>(this.userKey);

    if (storedUser) {
      authUser.telegramLink = storedUser.telegramLink;
    }

    this.addAuthUserInLocalStorage(authUser);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
