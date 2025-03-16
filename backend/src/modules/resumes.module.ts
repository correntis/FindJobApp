import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth.module";
import { Resume, ResumeSchema } from "src/schemas/resume.schema";
import { ResumesController } from "src/controllers/resumes.controller";
import { ResumesService } from "src/services/resumes.service";
import { ResumesRepository } from "src/repositories/resumes.repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
    AuthModule,
  ],
  controllers: [ResumesController],
  providers: [ResumesService, ResumesRepository],
  exports: [ResumesService, ResumesRepository],
})
export class ResumesModule {}
