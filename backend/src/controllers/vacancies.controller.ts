import { AuthGuard } from "@nestjs/passport";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateVacancyDto } from "src/dto/vacancy/create-vacancy.dto";
import { SearchVacancyDto } from "src/dto/vacancy/search-vacancy.dto";
import { UpdateVacancyDto } from "src/dto/vacancy/update-vacancy.dto";
import { VacancyDocument } from "src/schemas/vacancy.schema";
import { VacanciesService } from "src/services/vacancies.service";
import { Roles } from "src/decorators/role.decorator";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles-auth.guard";
import { UserRole } from "src/enums/user-role.enum";

@Controller("api/vacancies")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get("languages")
  @Roles(UserRole.User, UserRole.Company)
  @ApiOperation({ summary: "Get all existing languages" })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getAllLanguages(): Promise<unknown[]> {
    return this.vacanciesService.findAllLanguages();
  }

  @Post()
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Create vacancy" })
  @ApiBody({ type: CreateVacancyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Vacancy created successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  async create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Put(":vacancyId")
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Update vacancy" })
  @ApiParam({
    name: "vacancyId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "Vacancy ID",
  })
  @ApiBody({ type: UpdateVacancyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Vacancy updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Vacancy not found",
  })
  async update(
    @Param("vacancyId") vacancyId: string,
    @Body() updateVacancyDto: UpdateVacancyDto
  ) {
    return this.vacanciesService.update(vacancyId, updateVacancyDto);
  }

  @Put(":vacancyId/archive")
  @Roles(UserRole.Company)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Archive vacancy" })
  @ApiParam({
    name: "vacancyId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "Vacancy ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Vacancy archived successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Vacancy not found",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden: You can only archive your own vacancies",
  })
  async archive(@Param("vacancyId") vacancyId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.vacanciesService.archive(vacancyId, userId);
  }

  @Get(":vacancyId")
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Get vacancy by ID" })
  @ApiParam({
    name: "vacancyId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "Vacancy ID",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Vacancy found" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Vacancy not found",
  })
  async getById(@Param("vacancyId") vacancyId: string) {
    return this.vacanciesService.getById(vacancyId);
  }

  @Get("companies/:companyId")
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Get vacancy by ID" })
  @ApiParam({
    name: "companyId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "Vacancy ID",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Vacancy found" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Vacancy not found",
  })
  async getAllByCompany(
    @Param("companyId") companyId: string
  ): Promise<VacancyDocument[]> {
    return this.vacanciesService.getAllByCompany(companyId);
  }

  @Post("search")
  @Roles(UserRole.User, UserRole.Company)
  @ApiOperation({ summary: "Search vacancies with filters & pagination" })
  @ApiBody({ type: SearchVacancyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Filtered vacancies list",
  })
  async searchVacancies(
    @Body() searchDto: SearchVacancyDto
  ): Promise<VacancyDocument[] | null> {
    try {
      return this.vacanciesService.search(searchDto);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
