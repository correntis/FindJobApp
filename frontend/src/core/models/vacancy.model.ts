import { ExperienceLevel } from './experience-level.model';
import { Language } from './language.model';
import { Salary } from './salary.model';

export interface Vacancy {
  id: string;
  companyId: string;
  title: string;
  empl_type: string;
  is_archived: boolean;
  requirements: string[];
  skills: string[];
  tags: string[];
  salary: Salary;
  experience_level: ExperienceLevel;
  languages: Language[];
  created_at: Date;
}
