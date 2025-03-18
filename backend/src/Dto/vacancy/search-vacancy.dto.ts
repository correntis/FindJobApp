import { ApiProperty } from "@nestjs/swagger";

export class SearchVacancyDto {
  @ApiProperty({ required: false, example: 50000 })
  minSalary?: number;

  @ApiProperty({ required: false, example: 100000 })
  maxSalary?: number;

  @ApiProperty({ required: false, example: 2 })
  minExperience?: number;

  @ApiProperty({ required: false, example: 5 })
  maxExperience?: number;

  @ApiProperty({ required: false, example: "Full-time" })
  empl_type?: string;

  @ApiProperty({ required: false, type: [String], example: ["NestJS", "MongoDB"] })
  skills?: string[];

  @ApiProperty({ required: false, type: [String], example: ["English"] })
  languages?: string[];

  @ApiProperty({ required: false, type: [String], example: ["Remote"] })
  tags?: string[];

  @ApiProperty({ required: false, example: "65f8e3b5f3a2c7b9e1d5a7c3" })
  companyId?: string;

  @ApiProperty({ required: false, example: false })
  is_archived?: boolean;

  @ApiProperty({ required: false, example: 1 })
  page: number = 1;

  @ApiProperty({ required: false, example: 10 })
  limit: number = 10;
}
