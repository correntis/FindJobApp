import { ApiProperty } from "@nestjs/swagger";

export class LanguageDto {
  @ApiProperty({ example: "English", description: "Название языка" })
  name: string;

  @ApiProperty({ example: "B2", description: "Уровень владения языком" })
  level: string;
}