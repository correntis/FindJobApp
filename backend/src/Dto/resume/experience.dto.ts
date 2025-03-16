import { ApiProperty } from "@nestjs/swagger";

export class ExperienceDto {
  @ApiProperty({ example: "Software Engineer", description: "Должность" })
  jobTitle: string;

  @ApiProperty({ example: 3, description: "Количество лет опыта" })
  years: number;
}
