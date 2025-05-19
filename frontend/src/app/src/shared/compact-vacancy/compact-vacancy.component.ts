import { Component, Input } from '@angular/core';
import { Vacancy } from '../../../../core/models/vacancy.model';
import { Company } from '../../../../core/models/company.model';
import { CompaniesService } from '../../../../core/services/companies.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-compact-vacancy',
  standalone: true,
  imports: [MatIconModule, MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './compact-vacancy.component.html',
})
export class CompactVacancyComponent {
  @Input() vacancy?: Vacancy;

  company?: Company;

  constructor(
    private companiesService: CompaniesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCompany();
  }

  loadCompany(): void {
    if (this.vacancy?.companyId) {
      this.companiesService.getById(this.vacancy?.companyId).subscribe({
        next: (company: Company) => (this.company = company),
        error: (err: HttpErrorResponse) => console.error(err),
      });
    }
  }

  redirectToVacancyPage(): void {
    const tree = this.router.createUrlTree(['/vacancy', this.vacancy?.id]);
    const url = this.router.serializeUrl(tree);

    window.open(url, '_blank');
  }
}
