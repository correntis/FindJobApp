import { Injectable } from "@nestjs/common";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { ApplicationsRepository } from "src/repositories/applications.repository";
import { UsersRepository } from "src/repositories/users.repository";
import { VacanciesRepository } from "src/repositories/vacancies.repository";
import { CreateApplicationDto } from "src/dto/application/create-application.dto";
import { UpdateApplicationDto } from "src/dto/application/update-application.dto";
import {
  Application,
  ApplicationDocument,
} from "src/schemas/application.schema";
import { User } from "src/schemas/user.schema";
import { Vacancy } from "src/schemas/vacancy.schema";
import { TelegramService } from "./telegram.service";
import { ApplicationStatus } from "src/enums/applications-status.enum";

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly vacanciesRepository: VacanciesRepository,
    private readonly notifiactionService: TelegramService
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto
  ): Promise<ApplicationDocument> {
    const user = await this.usersRepository.findById(
      createApplicationDto.userId
    );
    if (!user) {
      throw new NotFoundException(User);
    }

    const vacancy = await this.vacanciesRepository.findById(
      createApplicationDto.vacancyId
    );
    if (!vacancy) {
      throw new NotFoundException(Vacancy);
    }

    return this.applicationsRepository.create(createApplicationDto);
  }

  async update(
    applicationId: string,
    updateApplicationDto: UpdateApplicationDto
  ): Promise<ApplicationDocument | null> {
    const application =
      await this.applicationsRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundException(Application);
    }

    var vacancy = await this.vacanciesRepository.findById(
      application.vacancyId
    );

    if (!vacancy) {
      throw new NotFoundException(Vacancy);
    }

    await this.notifiactionService.sendNotificationToUser(
      application.userId,
      `✨ *Update on your application!* ✨\n\n📄 You applied for: _${vacancy.title}_\n🏢 The company has updated your application status to: *${updateApplicationDto.status}*\n${
        updateApplicationDto.status === ApplicationStatus.Applied
          ? `💬 *Message for you:* ${updateApplicationDto.replyMessage}`
          : ""
      }`
    );
    

    return this.applicationsRepository.update(
      applicationId,
      updateApplicationDto
    );
  }

  async getById(applicationId: string): Promise<ApplicationDocument | null> {
    const application =
      await this.applicationsRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundException(Application);
    }

    return application;
  }

  async getByUserId(userId: string): Promise<ApplicationDocument[]> {
    return this.applicationsRepository.findByUserId(userId);
  }

  async getByVacancyId(vacancyId: string): Promise<ApplicationDocument[]> {
    return this.applicationsRepository.findByVacancyId(vacancyId);
  }

  async getByVacancyAndUser(
    vacancyId: string,
    userId: string
  ): Promise<ApplicationDocument> {
    const application = await this.applicationsRepository.findByVacancyAndUser(
      vacancyId,
      userId
    );

    if (!application) {
      throw new NotFoundException(Application);
    }

    return application;
  }

  async delete(applicationId: string): Promise<ApplicationDocument | null> {
    const application =
      await this.applicationsRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundException(Application);
    }

    return this.applicationsRepository.delete(applicationId);
  }
}
