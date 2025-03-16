import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateCompanyDto } from "src/dto/company/create-company.dto";
import { UpdateCompanyDto } from "src/dto/company/update-company.dto";
import { CompanyDocument } from "src/schemas/company.schema";
import { CompaniesService } from "src/services/companies.service";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: "Create company" })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok." })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Company for user or company with name already exist",
  })
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createCompanyDto: CreateCompanyDto
  ): Promise<CompanyDocument> {
    return this.companiesService.create(createCompanyDto);
  }

  @Put(":companyId")
  @ApiOperation({ summary: "Update company" })
  @ApiParam({ name: "companyId", example: "67cd909a4b8b3b90655c09de" })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok." })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Company not found",
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("companyId") companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<CompanyDocument> {
    return this.companiesService.update(companyId, updateCompanyDto);
  }

  @Get(":companyId")
  @ApiOperation({ summary: "Update company" })
  @ApiParam({ name: "companyId", example: "67cd909a4b8b3b90655c09de" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok." })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Company not found",
  })
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param("companyId") companyId: string
  ): Promise<CompanyDocument> {
    return this.companiesService.getById(companyId);
  }
}
