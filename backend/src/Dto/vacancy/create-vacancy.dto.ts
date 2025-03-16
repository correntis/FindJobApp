import { ApiProperty } from "@nestjs/swagger";
import { SalaryDto } from "./salary.dto";
import { ExperienceLevelDto } from "./experience-level.dto";
import { LanguageDto } from "./language.dto";

export class CreateVacancyDto {
  @ApiProperty({ example: "65f8e3b5f3a2c7b9e1d5a7c3", description: "ID компании" })
  companyId: string;

  @ApiProperty({ example: "Software Engineer", description: "Название вакансии" })
  title: string;

  @ApiProperty({ example: "Full-time", description: "Тип занятости" })
  empl_type: string;

  @ApiProperty({ example: false, description: "Флаг архивности вакансии", default: false })
  is_archived?: boolean;

  @ApiProperty({
    example: ["JavaScript", "TypeScript", "NestJS"],
    description: "Список требований",
  })
  requirements: string[];

  @ApiProperty({
    example: ["Node.js", "MongoDB", "Docker"],
    description: "Список навыков",
  })
  skills: string[];

  @ApiProperty({
    example: ["Remote", "Flexible schedule"],
    description: "Список тегов",
  })
  tags: string[];

  @ApiProperty({ description: "Диапазон зарплаты", type: SalaryDto })
  salary: SalaryDto;

  @ApiProperty({ description: "Требуемый уровень опыта", type: ExperienceLevelDto })
  experience_level: ExperienceLevelDto;

  @ApiProperty({
    description: "Список языков и уровней владения",
    type: [LanguageDto],
  })
  languages: LanguageDto[];
}
