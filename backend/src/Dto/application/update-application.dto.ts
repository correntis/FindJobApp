import { ApiProperty } from "@nestjs/swagger";
import { ApplicationStatus } from "src/enums/applications-status.enum";

export class UpdateApplicationDto {
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
