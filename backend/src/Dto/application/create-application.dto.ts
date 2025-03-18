import { ApiProperty } from "@nestjs/swagger";
import { ApplicationStatus } from "src/enums/applications-status.enum";

export class CreateApplicationDto {
  @ApiProperty({ example: "65f8e3b5f3a2c7b9e1d5a7c3", description: "User ID" })
  userId: string;

  @ApiProperty({ example: "65f9a4e1c8b3d2a7e4c9b7d6", description: "Vacancy ID" })
  vacancyId: string;

  @ApiProperty({
    example: "I am very interested in this position.",
    description: "Reply message from user",
    required: false,
  })
  replyMessage?: string;
}
