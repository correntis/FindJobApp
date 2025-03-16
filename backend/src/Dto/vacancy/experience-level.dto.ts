import { ApiProperty } from "@nestjs/swagger";

export class ExperienceLevelDto {
  @ApiProperty({ example: 1, description: "Минимальный уровень опыта (в годах)" })
  min: number;

  @ApiProperty({ example: 5, description: "Максимальный уровень опыта (в годах)" })
  max: number;
}