import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateResumeDto } from "src/dto/resume/create-resume.dto";
import { UpdateResumeDto } from "src/dto/resume/update-resume.dto";
import { ResumesService } from "src/services/resumes.service";

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ApiOperation({ summary: "Create resume" })
  @ApiBody({ type: CreateResumeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Resume created successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
  async create(@Body() createResumeDto: CreateResumeDto) {
    return this.resumesService.create(createResumeDto);
  }

  @Put(":resumeId")
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
}
