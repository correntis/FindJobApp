import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "src/decorators/role.decorator";
import { CreateApplicationDto } from "src/dto/application/create-application.dto";
import { UpdateApplicationDto } from "src/dto/application/update-application.dto";
import { UserRole } from "src/enums/user-role.enum";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles-auth.guard";
import { ApplicationsService } from "src/services/application.service";

@Controller("api/applications")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.User, UserRole.Company)
  @ApiOperation({ summary: "Submit an application" })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Application submitted successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User or Vacancy not found",
  })
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Put(":applicationId")
  @Roles(UserRole.User, UserRole.Company)
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
  @Roles(UserRole.User, UserRole.Company)
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
  @Roles(UserRole.User, UserRole.Company)
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
  @Roles(UserRole.User, UserRole.Company)
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

  @Get("vacancies/:vacancyId/users/:userId")
  @Roles(UserRole.User, UserRole.Company)
  @ApiOperation({ summary: "Get applications by vacancy ID" })
  @ApiParam({
    name: "vacancyId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "vacancy ID",
  })
  @ApiParam({
    name: "userId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "user ID",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Applications found" })
  async getByVacancyAndUser(
    @Param("vacancyId") vacancyId: string,
    @Param("userId") userId: string
  ) {
    return this.applicationsService.getByVacancyAndUser(vacancyId, userId);
  }
}
