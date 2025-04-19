import { ApiProperty } from "@nestjs/swagger";
import { LanguageDto } from "../vacancy/language.dto";
import { ExperienceDto } from "./experience.dto";

export class UpdateResumeDto {
  @ApiProperty({
    example: "Backend Developer",
    description: "Resume title",
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: "Experienced developer with 5 years of web development experience.",
    description: "Brief description (summary)",
    required: false,
  })
  summary?: string;

  @ApiProperty({
    example: ["MIT", "Stanford University"],
    description: "List of educational institutions",
    required: false,
  })
  educations?: string[];

  @ApiProperty({
    type: [ExperienceDto],
    description: "Work experience",
  })
  experiences: ExperienceDto[];

  @ApiProperty({
    example: ["Node.js", "NestJS", "MongoDB"],
    description: "Skills",
    required: false,
  })
  skills?: string[];

  @ApiProperty({
    example: ["backend", "typescript"],
    description: "Tags",
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: "List of languages and proficiency levels",
    type: [LanguageDto],
  })
  languages?: LanguageDto[];
}
