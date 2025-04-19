import { ChangeDetectorRef, Component, OnInit, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserRoles } from '../../../../core/enums/user-roles.enum';
import { AuthHelperService } from '../auth-helper.service';
import { UserStateService } from '../../../../core/services/user-state.service';
import { filter } from 'rxjs/operators';

type Route = {
  path: string;
  name: string;
  condition: boolean;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchControl = new FormControl('');
  isAuthenticated = false;
  isMobileMenuOpen = false;
  currentRoute = '';
  isScrolled = false;

  constructor(
    private router: Router, 
    private cdRef: ChangeDetectorRef,
    private authHelper: AuthHelperService,
    private userStateService: UserStateService,
    private authService: AuthService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.isAuthenticated = this.authHelper.isAuthenticated();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      this.cdRef.detectChanges();
    });

    this.cdRef.detectChanges();
  }

  isRouteActive(path: string): boolean {
    if (path === 'vacancies' && (this.currentRoute === '/' || this.currentRoute === '/vacancies')) {
      return true;
    }
    return this.currentRoute.includes(path);
  }

  getHeaderLinksRoutes(): Route[] {
    const routes: Route[] = [
      {
        path: 'vacancies',
        name: 'Vacancy',
        condition: true,
      },
      {
        path: 'profile/applications',
        name: 'My Applications',
        condition: this.authHelper.isUser(),
      },
      {
        path: 'profile/user',
        name: 'Profile',
        condition: this.authHelper.isUser(),
      },
      {
        path: 'profile/company',
        name: 'Company profile',
        condition: this.authHelper.isCompany(),
      },
    ];

    return routes;
  }

  isUser(): boolean {
    return this.authHelper.isUser();
  }

  isCompany(): boolean {
    return this.authHelper.isCompany();
  }

  getUserName(): string {
    const authUser = this.userStateService.authUserValue;
    if (authUser && authUser.user) {
      if (authUser.user.firstName && authUser.user.lastName) {
        return `${authUser.user.firstName} ${authUser.user.lastName}`;
      } else if (authUser.user.email) {
        return authUser.user.email;
      }
    }
    return 'User';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  goToProfile() {
    if (this.authHelper.isUser()) {
      this.router.navigate(['profile/user']);
    } else if (this.authHelper.isCompany()) {
      this.router.navigate(['profile/company']);
    }
    
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  goToRoute(route: string) {
    this.router.navigate([route]);
    
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.userStateService.setUser(null);
      this.router.navigate(['sign-in']);
    });
  }
}
