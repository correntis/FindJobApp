import { ApiProperty } from "@nestjs/swagger";
import { LanguageDto } from "../vacancy/language.dto";
import { ExperienceDto } from "./experience.dto";

export class CreateResumeDto {
  @ApiProperty({ example: "123456", description: "ID пользователя" })
  userId: string;

  @ApiProperty({ example: "Backend Developer", description: "Название резюме" })
  title: string;

  @ApiProperty({
    example: "Опытный разработчик с 5-летним стажем в веб-разработке.",
    description: "Краткое описание (саммари)",
  })
  summary: string;

  @ApiProperty({
    example: ["МГТУ им. Баумана", "СПбГУ"],
    description: "Список образовательных учреждений",
  })
  educations: string[];

  @ApiProperty({
    type: [ExperienceDto],
    description: "Опыт работы",
  })
  experiences: ExperienceDto[];

  @ApiProperty({
    example: ["Node.js", "NestJS", "MongoDB"],
    description: "Навыки",
  })
  skills: string[];

  @ApiProperty({
    example: ["backend", "typescript"],
    description: "Теги",
  })
  tags: string[];

  @ApiProperty({
    description: "Список языков и уровней владения",
    type: [LanguageDto],
  })
  languages?: LanguageDto[];
}
