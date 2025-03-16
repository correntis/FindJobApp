import { ApiProperty } from "@nestjs/swagger";
import { LanguageDto } from "../vacancy/language.dto";
import { ExperienceDto } from "./experience.dto";

export class UpdateResumeDto {
  @ApiProperty({
    example: "Backend Developer",
    description: "Название резюме",
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: "Опытный разработчик с 5-летним стажем в веб-разработке.",
    description: "Краткое описание (саммари)",
    required: false,
  })
  summary?: string;

  @ApiProperty({
    example: ["МГТУ им. Баумана", "СПбГУ"],
    description: "Список образовательных учреждений",
    required: false,
  })
  educations?: string[];

  @ApiProperty({
    type: [ExperienceDto],
    description: "Опыт работы",
  })
  experiences: ExperienceDto[];

  @ApiProperty({
    example: ["Node.js", "NestJS", "MongoDB"],
    description: "Навыки",
    required: false,
  })
  skills?: string[];

  @ApiProperty({
    example: ["backend", "typescript"],
    description: "Теги",
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: "Список языков и уровней владения",
    type: [LanguageDto],
  })
  languages?: LanguageDto[];
}
