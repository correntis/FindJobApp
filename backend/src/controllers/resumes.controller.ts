import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/decorators/role.decorator";
import { CreateResumeDto } from "src/dto/resume/create-resume.dto";
import { UpdateResumeDto } from "src/dto/resume/update-resume.dto";
import { UserRole } from "src/enums/user-role.enum";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles-auth.guard";
import { ResumesService } from "src/services/resumes.service";

@Controller("api/resumes")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Create resume" })
  @ApiBody({ type: CreateResumeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Resume created successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: "Resume with this user ID already exists" 
  })
  async create(@Body() createResumeDto: CreateResumeDto) {
    return this.resumesService.create(createResumeDto);
  }

  @Put(":resumeId")
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Update resume" })
  @ApiParam({
    name: "resumeId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "Resume ID",
  })
  @ApiBody({ type: UpdateResumeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Resume updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Resume not found",
  })
  async update(
    @Param("resumeId") resumeId: string,
    @Body() updateResumeDto: UpdateResumeDto
  ) {
    return this.resumesService.update(resumeId, updateResumeDto);
  }

  @Delete(":resumeId")
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Delete resume" })
  @ApiParam({
    name: "resumeId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "Resume ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Resume deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Resume not found",
  })
  async delete(@Param("resumeId") resumeId: string) {
    return this.resumesService.delete(resumeId);
  }

  @Get(":resumeId")
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Get resume by ID" })
  @ApiParam({
    name: "resumeId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "Resume ID",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Resume found" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Resume not found",
  })
  async getById(@Param("resumeId") resumeId: string) {
    return this.resumesService.getById(resumeId);
  }

  @Get("users/:userId")
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Get resume by user ID" })
  @ApiParam({
    name: "userId",
    example: "65f8e3b5f3a2c7b9e1d5a7c3",
    description: "User ID",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Resume found" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Resume not found",
  })
  async getByUserId(@Param("userId") userId: string) {
    const resume = await this.resumesService.getByUserId(userId);
    return resume;
  }
}
