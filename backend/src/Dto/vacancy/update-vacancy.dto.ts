import { ApiProperty } from "@nestjs/swagger";
import { SalaryDto } from "./salary.dto";
import { ExperienceLevelDto } from "./experience-level.dto";
import { LanguageDto } from "./language.dto";

export class UpdateVacancyDto {
  @ApiProperty({
    example: "Software Engineer",
    description: "Название вакансии",
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: "Full-time",
    description: "Тип занятости",
    required: false,
  })
  empl_type?: string;

  @ApiProperty({
    example: true,
    description: "Флаг архивности вакансии",
    required: false,
  })
  is_archived?: boolean;

  @ApiProperty({ example: false, description: "Для инвалидов", default: false })
  for_invalids: boolean;

  @ApiProperty({
    example: 18,
    description: "Минимальный возраст соискателя",
    default: 18,
  })
  min_age: number;

  @ApiProperty({
    example: ["JavaScript", "TypeScript", "NestJS"],
    description: "Список требований",
    required: false,
  })
  requirements?: string[];

  @ApiProperty({
    example: ["Node.js", "MongoDB", "Docker"],
    description: "Список навыков",
    required: false,
  })
  skills?: string[];

  @ApiProperty({
    example: ["Remote", "Flexible schedule"],
    description: "Список тегов",
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: "Диапазон зарплаты",
    type: SalaryDto,
    required: false,
  })
  salary?: SalaryDto;

  @ApiProperty({
    description: "Требуемый уровень опыта",
    type: ExperienceLevelDto,
    required: false,
  })
  experience_level?: ExperienceLevelDto;

  @ApiProperty({
    description: "Список языков и уровней владения",
    type: [LanguageDto],
    required: false,
  })
  languages?: LanguageDto[];
}
