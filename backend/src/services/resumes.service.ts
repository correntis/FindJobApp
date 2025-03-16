import { Injectable } from "@nestjs/common";
import { Resume, ResumeDocument } from "src/schemas/resume.schema";
import { CreateResumeDto } from "src/dto/resume/create-resume.dto";
import { UpdateResumeDto } from "src/dto/resume/update-resume.dto";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { ResumesRepository } from "src/repositories/resumes.repository";

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumesRepository) {}

  async create(createResumeDto: CreateResumeDto): Promise<ResumeDocument> {
    return this.resumesRepository.create(createResumeDto);
  }

  async update(
    resumeId: string,
    updateResumeDto: UpdateResumeDto
  ): Promise<ResumeDocument | null> {
    const resume = await this.resumesRepository.findById(resumeId);

    if (!resume) {
      throw new NotFoundException(Resume);
    }

    return this.resumesRepository.update(resumeId, updateResumeDto);
  }

  async delete(resumeId: string): Promise<ResumeDocument | null> {
    const resume = await this.resumesRepository.findById(resumeId);

    if (!resume) {
      throw new NotFoundException(Resume);
    }

    return this.resumesRepository.delete(resumeId);
  }

  async getById(resumeId: string): Promise<ResumeDocument | null> {
    const resume = await this.resumesRepository.findById(resumeId);

    if (!resume) {
      throw new NotFoundException(Resume);
    }

    return resume;
  }
}
