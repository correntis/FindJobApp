import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateVacancyDto } from "src/dto/vacancy/create-vacancy.dto";
import { SearchVacancyDto } from "src/dto/vacancy/search-vacancy.dto";
import { UpdateVacancyDto } from "src/dto/vacancy/update-vacancy.dto";
import { VacancyDocument } from "src/schemas/vacancy.schema";
import { VacanciesService } from "src/services/vacancies.service";

@Controller("vacancies")
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
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
  async archive(@Param("vacancyId") vacancyId: string) {
    return this.vacanciesService.archive(vacancyId);
  }

  @Get(":vacancyId")
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

  @Post("search")
  @ApiOperation({ summary: "Search vacancies with filters & pagination" })
  @ApiBody({type: SearchVacancyDto})
  @ApiResponse({ status: HttpStatus.OK, description: "Filtered vacancies list" })
  async searchVacancies(@Body() searchDto: SearchVacancyDto): Promise<VacancyDocument[]> {
    return this.vacanciesService.search(searchDto);
  }
}
