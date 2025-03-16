import { Vacancy, VacancyDocument } from "./../schemas/vacancy.schema";
import { Injectable } from "@nestjs/common";
import { CreateVacancyDto } from "src/dto/vacancy/create-vacancy.dto";
import { UpdateVacancyDto } from "src/dto/vacancy/update-vacancy.dto";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { CompaniesRepository } from "src/repositories/companies.repository";
import { VacanciesRepository } from "src/repositories/vacancies.repository";
import { Company } from "src/schemas/company.schema";

@Injectable()
export class VacanciesService {
  constructor(
    private readonly vacanciesRepositoty: VacanciesRepository,
    private readonly companiesRepository: CompaniesRepository
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<VacancyDocument> {
    const company = await this.companiesRepository.findById(
      createVacancyDto.companyId
    );

    if (!company) {
      throw new NotFoundException(Company);
    }

    return this.vacanciesRepositoty.create(createVacancyDto);
  }

  async update(
    vacancyId: string,
    updateVacancyDto: UpdateVacancyDto
  ): Promise<VacancyDocument | null> {
    const vacancy = await this.vacanciesRepositoty.findById(vacancyId);

    if (!vacancy) {
      throw new NotFoundException(Vacancy);
    }

    return this.vacanciesRepositoty.update(vacancyId, updateVacancyDto);
  }

  async archive(vacancyId: string): Promise<VacancyDocument | null> {
    const vacancy = await this.vacanciesRepositoty.findById(vacancyId);

    if (!vacancy) {
      throw new NotFoundException(Vacancy);
    }

    return this.vacanciesRepositoty.archive(vacancyId);
  }

  async getById(vacancyId: string): Promise<VacancyDocument | null> {
    const vacancy = await this.vacanciesRepositoty.findById(vacancyId);

    if (!vacancy) {
      throw new NotFoundException(Vacancy);
    }

    return vacancy;
  }
}
