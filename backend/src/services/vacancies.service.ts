import { Vacancy, VacancyDocument } from "./../schemas/vacancy.schema";
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { CreateVacancyDto } from "src/dto/vacancy/create-vacancy.dto";
import { UpdateVacancyDto } from "src/dto/vacancy/update-vacancy.dto";
import { CompaniesRepository } from "src/repositories/companies.repository";
import { VacanciesRepository } from "src/repositories/vacancies.repository";
import { Company } from "src/schemas/company.schema";

@Injectable()
export class VacanciesService {
  constructor(
    private readonly vacanciesRepository: VacanciesRepository,
    private readonly companiesRepository: CompaniesRepository
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<VacancyDocument> {
    const company = await this.companiesRepository.findById(
      createVacancyDto.companyId
    );

    if (!company) {
      throw new NotFoundException(Company);
    }

    return this.vacanciesRepository.create(createVacancyDto);
  }

  async update(
    vacancyId: string,
    updateVacancyDto: UpdateVacancyDto
  ): Promise<VacancyDocument | null> {
    const vacancy = await this.vacanciesRepository.findById(vacancyId);

    if (!vacancy) {
      throw new NotFoundException(Vacancy);
    }

    return this.vacanciesRepository.update(vacancyId, updateVacancyDto);
  }

  async archive(vacancyId: string, userId: string): Promise<VacancyDocument | null> {
    const vacancy = await this.vacanciesRepository.findById(vacancyId);

    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    // Получаем компанию, которой принадлежит вакансия
    const company = await this.companiesRepository.findById(vacancy.companyId);
    
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Проверяем, принадлежит ли компания текущему пользователю
    if (company.userId !== userId) {
      throw new ForbiddenException('You can only archive your own vacancies');
    }

    // Инвертируем текущее состояние архивации
    const isCurrentlyArchived = vacancy.is_archived || false;
    return this.vacanciesRepository.toggleArchive(vacancyId, !isCurrentlyArchived);
  }

  async getById(vacancyId: string): Promise<VacancyDocument | null> {
    const vacancy = await this.vacanciesRepository.findById(vacancyId);

    if (!vacancy) {
      throw new NotFoundException(Vacancy);
    }

    return vacancy;
  }

  
  async getAllByCompany(companyId: string): Promise<VacancyDocument[]> {
    return this.vacanciesRepository.findAllByCompany(companyId);
  }

  async search(filters: any): Promise<VacancyDocument[]> {
    return this.vacanciesRepository.search(filters);
  }
}
