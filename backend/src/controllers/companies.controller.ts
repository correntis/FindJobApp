import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CreateCompanyDto } from "src/Dto/company/create-company.dto";
import { UpdateCompanyDto } from "src/Dto/company/update-company.dto";
import { CompanyDocument } from "src/schemas/company.schema";
import { CompaniesService } from "src/services/companies.service";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(
    @Body() createCompanyDto: CreateCompanyDto
  ): Promise<CompanyDocument> {
    return this.companiesService.create(createCompanyDto);
  }

  @Put(":companyId")
  async update(
    @Param("companyId") companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<CompanyDocument> {
    return this.companiesService.update(companyId, updateCompanyDto);
  }

  @Get(":companyId")
  async getById(
    @Param("companyId") companyId: string
  ): Promise<CompanyDocument> {
    return this.companiesService.getById(companyId);
  }
}
