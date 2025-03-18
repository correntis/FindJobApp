import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
  } from "@nestjs/common";
  import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
  import { CreateApplicationDto } from "src/dto/application/create-application.dto";
  import { UpdateApplicationDto } from "src/dto/application/update-application.dto";
import { ApplicationsService } from "src/services/application.service";
  
  @ApiTags("Applications")
  @Controller("applications")
  export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) {}
  
    @Post()
    @ApiOperation({ summary: "Submit an application" })
    @ApiBody({ type: CreateApplicationDto })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: "Application submitted successfully",
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User or Vacancy not found" })
    async create(@Body() createApplicationDto: CreateApplicationDto) {
      return this.applicationsService.create(createApplicationDto);
    }
  
    @Put(":applicationId")
    @ApiOperation({ summary: "Update application status" })
    @ApiParam({
      name: "applicationId",
      example: "65f8e3b5f3a2c7b9e1d5a7c3",
      description: "Application ID",
    })
    @ApiBody({ type: UpdateApplicationDto })
    @ApiResponse({
      status: HttpStatus.OK,
      description: "Application updated successfully",
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: "Application not found",
    })
    async update(
      @Param("applicationId") applicationId: string,
      @Body() updateApplicationDto: UpdateApplicationDto
    ) {
      return this.applicationsService.update(applicationId, updateApplicationDto);
    }
  
    @Get(":applicationId")
    @ApiOperation({ summary: "Get application by ID" })
    @ApiParam({
      name: "applicationId",
      example: "65f8e3b5f3a2c7b9e1d5a7c3",
      description: "Application ID",
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Application found" })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: "Application not found",
    })
    async getById(@Param("applicationId") applicationId: string) {
      return this.applicationsService.getById(applicationId);
    }

    @Get("users/:userId")
    @ApiOperation({ summary: "Get applications by user ID" })
    @ApiParam({
      name: "userId",
      example: "65f8e3b5f3a2c7b9e1d5a7c3",
      description: "userId ID",
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Applications found" })
    async getByUser(@Param("userId") userId: string) {
      return this.applicationsService.getByUserId(userId);
    }

    @Get("vacancies/:vacancyId")
    @ApiOperation({ summary: "Get applications by vacancy ID" })
    @ApiParam({
      name: "vacancyId",
      example: "65f8e3b5f3a2c7b9e1d5a7c3",
      description: "vacancy ID",
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Applications found" })
    async getByVacancy(@Param("vacancyId") vacancyId: string) {
      return this.applicationsService.getByVacancyId(vacancyId);
    }
  }
  