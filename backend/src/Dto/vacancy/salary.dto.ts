import { ApiProperty } from "@nestjs/swagger";

export class SalaryDto {
  @ApiProperty({ example: 50000, description: "Минимальная зарплата" })
  min: number;

  @ApiProperty({ example: 100000, description: "Максимальная зарплата" })
  max: number;
}