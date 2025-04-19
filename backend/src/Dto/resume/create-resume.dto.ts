import { ApiProperty } from "@nestjs/swagger";
import { LanguageDto } from "../vacancy/language.dto";
import { ExperienceDto } from "./experience.dto";

export class CreateResumeDto {
  @ApiProperty({ example: "123456", description: "User ID" })
  userId: string;

  @ApiProperty({ example: "Backend Developer", description: "Resume title" })
  title: string;

  @ApiProperty({
    example: "Experienced developer with 5 years of web development experience.",
    description: "Brief description (summary)",
  })
  summary: string;

  @ApiProperty({
    example: ["MIT", "Stanford University"],
    description: "List of educational institutions",
  })
  educations: string[];

  @ApiProperty({
    type: [ExperienceDto],
    description: "Work experience",
  })
  experiences: ExperienceDto[];

  @ApiProperty({
    example: ["Node.js", "NestJS", "MongoDB"],
    description: "Skills",
  })
  skills: string[];

  @ApiProperty({
    example: ["backend", "typescript"],
    description: "Tags",
  })
  tags: string[];

  @ApiProperty({
    description: "List of languages and proficiency levels",
    type: [LanguageDto],
  })
  languages?: LanguageDto[];
}
