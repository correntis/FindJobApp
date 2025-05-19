import { CreateCompanyDto } from "src/dto/company/create-company.dto";
import { Company } from "./../schemas/company.schema";
import { Injectable } from "@nestjs/common";
import { AlreadyExistException } from "src/exceptions/already-exist.exception";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { CompaniesRepository } from "src/repositories/companies.repository";
import { CompanyDocument } from "src/schemas/company.schema";
import { UpdateCompanyDto } from "src/dto/company/update-company.dto";

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async create(companyData: CreateCompanyDto): Promise<CompanyDocument> {
    const existingCompany = await this.companiesRepository.findByUser(
      companyData.userId
    );

    if (existingCompany) {
      throw new AlreadyExistException(Company);
    }

    return this.companiesRepository.create(companyData);
  }

  async update(
    companyId: string,
    companyData: UpdateCompanyDto
  ): Promise<CompanyDocument> {
    const company = await this.companiesRepository.update(
      companyId,
      companyData
    );

    if (!company) {
      throw new NotFoundException(Company);
    }

    return company;
  }

  async getById(companyId: string): Promise<CompanyDocument> {
    const company = await this.companiesRepository.findById(companyId);

    if (!company) {
      throw new NotFoundException(Company);
    }

    return company;
  }

  async getByName(companyName: string): Promise<CompanyDocument> {
    const company = await this.companiesRepository.findByName(companyName);

    if (!company) {
      throw new NotFoundException(Company);
    }

    return company;
  }

  async getByUserId(userId: string): Promise<CompanyDocument | null> {
    const company = await this.companiesRepository.findByUser(userId);
    return company;
  }
}
