import { Experience } from './experience.model';
import { Language } from './language.model';

export interface Resume {
  id: string;
  userId: string;
  title: string;
  summary: string;
  educations: string[];
  experiences: Experience[];
  tags: string[];
  skills: string[];
  languages: Language[];
}
