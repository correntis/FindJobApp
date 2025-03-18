import { ApiProperty } from "@nestjs/swagger";
import { ApplicationStatus } from "src/enums/applications-status.enum";

export class UpdateApplicationDto {
  @ApiProperty({
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "Application ID",
  })
  applicationId: string;

  @ApiProperty({
    example: "Accepted",
    enum: ApplicationStatus,
    description: "Status of the application",
  })
  status: ApplicationStatus;

  @ApiProperty({
    example: "Congratulations! You are hired.",
    description: "Reply message from employer",
    required: false,
  })
  replyMessage?: string;
}
