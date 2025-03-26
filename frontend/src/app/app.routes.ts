import { Routes } from '@angular/router';
import { AuthPageComponent } from './src/pages/auth/auth-page/auth-page.component';
import { VacanciesPageComponent } from './src/pages/vacancies/vacancies-page/vacancies-page.component';
import { VacancyViewComponent } from './src/pages/vacancies/vacancy-view/vacancy-view.component';
import { CompanyViewComponent } from './src/pages/companies/company-view/company-view.component';
import { UserProfileComponent } from './src/pages/profile/user-profile/user-profile.component';
import { CompanyProfileComponent } from './src/pages/profile/company-profile/company-profile.component';
import { ResumeEditComponent } from './src/pages/profile/resume-edit/resume-edit.component';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';
import { UserRoles } from '../core/enums/user-roles.enum';
import { CreateVacancyComponent } from './src/pages/vacancies/create-vacancy/create-vacancy.component';
import { ApplicationsListComponent } from './src/pages/vacancies/applications-list/applications-list.component';

export const routes: Routes = [
  { path: 'sign-in', component: AuthPageComponent },
  { path: 'vacancies', component: VacanciesPageComponent },
  { path: 'vacancy/:vacancyId', component: VacancyViewComponent},
  { path: 'company/:companyId', component: CompanyViewComponent},
  { 
    path: 'profile/user', 
    component: UserProfileComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRoles.User] }
  },
  { 
    path: 'profile/company', 
    component: CompanyProfileComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRoles.Company] }
  },
  { 
    path: 'profile/resume/edit/:resumeId', 
    component: ResumeEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRoles.User] }
  },
  { 
    path: 'profile/resume/create', 
    component: ResumeEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRoles.User] }
  },
  { 
    path: 'vacancies/create', 
    component: CreateVacancyComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRoles.Company] }
  },
  { 
    path: 'vacancies/edit/:vacancyId', 
    component: CreateVacancyComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRoles.Company] }
  },
  { 
    path: 'vacancies/:vacancyId/applications', 
    component: ApplicationsListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRoles.Company] }
  },
  { path: '**', redirectTo: 'vacancies'}
];
