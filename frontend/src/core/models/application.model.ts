import { ApplicationStatus } from "../enums/application-status.enum";

export interface Application {
  id: string;
  userId: string;
  vacancyId: string;
  status: ApplicationStatus;
  replyMessage?: string;
  appliedAt: Date;
}
