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
import { CompaniesRepository } from "src/repositories/companies.repository";
import { Company } from "src/schemas/company.schema";

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly vacanciesRepository: VacanciesRepository,
    private readonly notifiactionService: TelegramService,
    private readonly companiesRepository: CompaniesRepository
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

    const company = await this.companiesRepository.findById(vacancy.companyId);
    if (!company) {
      throw new NotFoundException(Company);
    }

    const companyUser = await this.usersRepository.findById(company.userId);
    if (!companyUser) {
      throw new NotFoundException(User);
    }

    await this.notifiactionService.sendNotificationToUser(
      companyUser.id,
      `✨ *На вашу вакансию откликнулись! ✨\n\n📄 Вакансия: _${vacancy.title}_\n🏢 Соискатель: *${user.firstName} ${user.lastName}*\n`
    );

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
      `✨ *Обновление в вашем отклике!* ✨\n\n📄 Вы откликались на: _${vacancy.title}_\n🏢 Компания ответила вам со статусом: *${updateApplicationDto.status}*\n${`💬 *Сообщеие для вас:* ${updateApplicationDto.replyMessage}`}`
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
