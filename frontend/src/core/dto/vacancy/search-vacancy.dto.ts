export interface SearchVacancyDto {
  minSalary: number;
  maxSalary: number;
  minExperience: number;
  maxExperience: number;
  empl_type: string;
  skills: string[];
  languages: string[];
  tags: string[];
  companyId: string;
  is_archived: boolean;
  page: number;
  limit: number;
}
